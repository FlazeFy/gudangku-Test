const { collection, addDoc } = require('firebase/firestore')
const { db } = require('./init')

const add_firestore = async (data, ref) => {
    try {
        const docRef = await addDoc(collection(db, ref), data)
        return docRef.id
    } catch (e) {
        throw e
    }
};

module.exports = { add_firestore }
