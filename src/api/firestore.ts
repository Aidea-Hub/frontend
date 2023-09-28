import {
    collection,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    startAfter,
    where,
} from 'firebase/firestore'
import firebase from '../config/firebase'

const db = getFirestore(firebase)

export const findIdeaById = async (id: string) => {
    const d = await getDoc(doc(db, "idea_contents", id))
    return d.data()
}