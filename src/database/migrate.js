import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/abstracttetris';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB for migrations');

        // Criando a coleção gameStates se não existir
        await mongoose.connection.db.createCollection('gamestates').catch(err => console.log('Collection already exists'));

        console.log('✅ Migrations applied successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error);
        process.exit(1);
    }
};

connectDB();
