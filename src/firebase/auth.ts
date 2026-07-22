import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/firebase/app";

export const firebaseAuth = getAuth(firebaseApp);
