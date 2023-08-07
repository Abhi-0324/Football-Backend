import bcrypt from 'bcrypt'

export const hashPassword = async(password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        return hashedPassword;
    } catch (error) {
        console.log('Failed to hash Password');
    }
}

export const comparePassword = async(password, hashedPassword) => {
    try {
        const doesMatch = await bcrypt.compare(password, hashedPassword);
        return doesMatch;
    } catch (error) {
        return false;
    }
}