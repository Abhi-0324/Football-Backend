import match from "../../models/Match.js";
import player from "../../models/Player.js";
import team from "../../models/Team.js";

export const newMatch = async (req, res) => {
  try {
    const {
      tournament,
      matchNumber,
      matchName,
      venue,
      date,
      halfLength,
      extraTimeHalfLength,
      teamA,
      teamB,
      playersA,
      playersB,
      teamAEvents,
      teamBEvents,
      teamAScore,
      teamBScore,
      teamAPenalties,
      teamBPenalties,
      status,
    } = req.body;

    if (!tournament || !teamA || !teamB || !date || !halfLength) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const matchDetails = await match.create({
      tournament,
      matchNumber,
      matchName,
      date,
      venue,
      halfLength,
      extraTimeHalfLength,
      teamA,
      teamB,
      playersA,
      playersB,
      teamAEvents,
      teamBEvents,
      teamAScore,
      teamBScore,
      teamAPenalties,
      teamBPenalties,
      status: status ? status : "upcoming",
    });

    return res.status(200).send({
      success: true,
      message: "Match created successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const endMatch = async (req, res) => {
  try {
    const id = req.params.id;

    const matchDetails = await match.findById(id);

    if (!matchDetails) {
      return res.status(404).send({
        success: false,
        message: "Match not found",
      });
    }

    //find winner of match
    if (matchDetails.teamAScore > matchDetails.teamBScore)
      matchDetails.winner = "A";
    else if (matchDetails.teamBScore > matchDetails.teamAScore)
      matchDetails.winner = "B";
    else if (matchDetails.teamAPenalties && matchDetails.teamBPenalties) {
      if (matchDetails.teamAPenalties > matchDetails.teamBPenalties)
        matchDetails.winner = "A";
      else matchDetails.winner = "B";
    } else matchDetails.winner = "draw";

    //increase stats of teams
    const teamA = await team.findById(matchDetails.teamA);
    const teamB = await team.findById(matchDetails.teamB);

    teamA.numberOfMatches++;
    teamB.numberOfMatches++;

    teamA.goals += matchDetails.teamAScore;
    teamB.goals += matchDetails.teamBScore;

    if (matchDetails.winner === "draw") {
      teamA.draw++;
      teamB.draw++;
    } else if (matchDetails.winner === "A") {
      teamA.wins++;
      teamB.loses++;
    } else {
      teamB.wins++;
      teamA.loses++;
    }

    if (matchDetails.teamAScore === 0) {
      teamA.cleanSheets++;
    }
    if (matchDetails.teamBScore === 0) {
      teamB.cleanSheets++;
    }

    await teamA.save();
    await teamB.save();

    //update stats of player

    const playersA = matchDetails.playersA;
    const playersB = matchDetails.playersB;

    await player.updateMany(
      { _id: { $in: [...playersA, ...playersB] } },
      { $inc: { matches: 1 } },
      { new: true }
    );

    const teamAEvents = matchDetails.teamAEvents;
    const teamBEvents = matchDetails.teamBEvents;
    const updateStats = async (event) => {
      const Player = await player.findById(event.player);
      if (!Player) return;
      if (event.type === "goal") {
        Player.goals++;

        if (event.assist) {
          const assister = await player.findById(event.assist);
          if (assister) {
            assister.assists++;
            await assister.save(); // Make sure to use 'await' here to properly handle the promise
          }
        }
      } else if (event.type === "yellowCard") {
        Player.yellowCards++;
      } else if (event.type === "redCard") {
        Player.redCards++;
      }

      await Player.save();
    };

    // Create an array of promises by calling updateStats for each event
    const updatePromises = [...teamAEvents, ...teamBEvents].map((event) =>
      updateStats(event)
    );


    matchDetails.status='ended';
    await matchDetails.save();


    await Promise.all(updatePromises)

    return res.status(200).send({
      success: true,
      message: 'Match ended'
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateWholeMatch = async (req, res) => {
  try {
    const id = req.params.id;
    const dataToUpdate = req.body;

    const Match = await match.findOneAndUpdate(
      {_id: id},
      { $set: dataToUpdate},
      { new: true}
    );

    if(!Match){
      return res.status(404).send({
        success: false,
        message: 'Match not found'
      })
    }

    return res.status(200).send({
      success: true,
      message: 'Match details updated'
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateScore = async (req, res) => {
  try {
    const id = req.params.id;
    const { team, event } = req.body;
    const Match = await match.findById(id);

    if (!Match) {
      return res.status(404).send({
        success: false,
        message: "Match not found",
      });
    }

    if(Match.status === 'ended'){
      return res.status(400).send({
        success: false,
        message: 'Match has ended'
      })
    }

    Match.status = 'ongoing'

    if (team === "A") {
      Match.teamAScore++;
      Match.teamAEvents.push(event);
    }
    if (team === "B") {
      Match.teamBScore++;
      Match.teamBEvents.push(event);
    }
    await Match.save();

    return res.status(200).send({
      success: true,
      message: "Match Data updated",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const { team, event } = req.body;

    const Match = await match.findById(id);

    if (!Match) {
      return res.status(404).send({
        success: false,
        message: "Match not found",
      });
    }

    if (team === "A") Match.teamAEvents.push(event);
    else if (team === "B") Match.teamBEvents.push(event);

    Match.save();

    return res.status(200).send({
      success: true,
      message: "Event added",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const Match = await match.findById(id);
    if (!Match) {
      return res.status(404).send({
        success: false,
        message: "Match Not Found",
      });
    }
    Match.status = status;

    Match.save();

    return res.status(200).send({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const startHalf = async (req, res) => {
  try {
    const id = req.params.id;
    const { half } = req.body;
    const Match = await match.findById(id);

    if (!Match) {
      return res.status(404).send({
        success: false,
        message: "Could not find match",
      });
    }

    if (half === "firstHalf") Match.firstHalfStartTime = new Date();
    else if (half === "secondHalf") Match.secondHalfStartTime = new Date();
    else if (half === "extraTimeFirstHalf")
      Match.extraTimeFirstHalfStartTime = new Date();
    else if (half === "extraTimeSecondHalf")
      Match.extraTimeSecondHalfStartTime = new Date();

    await Match.save();

    return res.status(200).send({
      success: true,
      message: "Half Started",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const endHalf = async(req,res) => {
  try {
    const id = req.params.id;

    const Match = await match.findById(id);

    switch(Match.currentHalf){
      case 'firstHalf': Match.currentHalf = 'halfTime'
                        break;
      case 'halfTime':  Match.currentHalf = 'secondHalf'
                        break;
      case 'secondHalf':Match.currentHalf = 'fullTime'
                        break;
      case 'fullTime':  Match.currentHalf = 'extraTimeFirstHalf'
                        break;
      case 'extraTimeFirstHalf': Match.currentHalf = 'extraTimeHalfTime'
                        break;
      case 'extraTimeHalfTime' : Match.currentHalf = 'extraTimeSecondHalf'
                        break;
      case 'extraTimeSecondHalf': Match.currentHalf = 'extraTimeFullTime'
                        break;
      case 'extraTimeFullTime'  : Match.currentHalf = 'penalties'
                        break;
      case 'penalties' :  Match.currentHalf = 'fullTime'
                        break;
    }

    await Match.save();

    return res.status(200).send({
      success: true,
      message: 'current status of half changed'
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

//get requests

export const getMatchDetails = async (req, res) => {
  try {
    const id = req.params.id;

    const Match = await match.findById(id);

    if (!Match) {
      return res.status(200).send({
        success: false,
        message: "Match not found",
      });
    }

    return res.status(200).send({
      success: true,
      matchDetails: Match,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getMatchesList = async(req,res) => {
  try {
    const status = req.params.status;
    let matchesList;
    if(status === 'all'){
      matchesList = await match.find({})
      return res.status(200).send({
        success: true,
        matchesList
      })
    }  
    else{
      matchesList = await match.find({status})
      return res.status(200).send({
        success: true,
        matchesList
      })
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error'
    })
  }
}