import type { Lesson, Unit } from "@/types/curriculum.types";

export const CURRICULUM: Unit[] = [
  {
    id: "daily-life",
    title: "Vida diária",
    level: "A1",
    description: "Rotina, horários e hábitos simples.",
    lessons: [
      {
        id: "daily-life-1",
        title: "Falando sobre rotina",
        teachingSentence: "I wake up at seven and have breakfast before work.",
        teachingNote:
          'Usamos o Present Simple para hábitos e rotinas. Na terceira pessoa (she/he/it) o verbo ganha "-s": "she wakes up".',
        exercises: [
          {
            id: "daily-life-1-e1",
            prompt: "She ___ up at 7 AM every day.",
            options: ["wake", "wakes", "waking", "woke"],
            correctIndex: 1,
          },
          {
            id: "daily-life-1-e2",
            prompt: "I usually ___ breakfast before work.",
            options: ["have", "has", "having", "had"],
            correctIndex: 0,
          },
          {
            id: "daily-life-1-e3",
            prompt: "What time do you ___ up?",
            options: ["wake", "wakes", "waking", "woke"],
            correctIndex: 0,
          },
        ],
      },
      {
        id: "daily-life-2",
        title: "Fazendo perguntas simples",
        teachingSentence: "Where do you usually eat lunch?",
        teachingNote:
          'Perguntas no Present Simple usam "do/does" antes do sujeito: "Where do you eat?", "Where does she eat?".',
        exercises: [
          {
            id: "daily-life-2-e1",
            prompt: "___ you like coffee?",
            options: ["Do", "Does", "Are", "Is"],
            correctIndex: 0,
          },
          {
            id: "daily-life-2-e2",
            prompt: "___ she work on Saturdays?",
            options: ["Do", "Does", "Is", "Are"],
            correctIndex: 1,
          },
          {
            id: "daily-life-2-e3",
            prompt: "Where ___ they live?",
            options: ["do", "does", "is", "are"],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
  {
    id: "travel-basics",
    title: "Viagens",
    level: "A2",
    description: "Frases úteis para se virar viajando.",
    lessons: [
      {
        id: "travel-basics-1",
        title: "No aeroporto",
        teachingSentence: "Excuse me, where is the gate for flight 205?",
        teachingNote:
          'Use "Excuse me" pra chamar atenção educadamente antes de perguntar algo a um estranho.',
        exercises: [
          {
            id: "travel-basics-1-e1",
            prompt: "Excuse me, ___ is the nearest exit?",
            options: ["where", "what", "who", "when"],
            correctIndex: 0,
          },
          {
            id: "travel-basics-1-e2",
            prompt: "I'd like to ___ a window seat, please.",
            options: ["reserve", "reserving", "reserved", "reserves"],
            correctIndex: 0,
          },
          {
            id: "travel-basics-1-e3",
            prompt: "What time does the flight ___?",
            options: ["depart", "departs", "departing", "departed"],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
  {
    id: "job-interview-basics",
    title: "Entrevistas de emprego",
    level: "B1",
    description: "Frases-chave para se apresentar profissionalmente.",
    lessons: [
      {
        id: "job-interview-basics-1",
        title: "Falando sobre experiência",
        teachingSentence: "I have worked in customer service for three years.",
        teachingNote:
          'Present Perfect ("have/has + particípio") conecta uma experiência passada com o presente — ainda relevante hoje.',
        exercises: [
          {
            id: "job-interview-basics-1-e1",
            prompt: "I ___ in marketing for five years.",
            options: ["work", "worked", "have worked", "working"],
            correctIndex: 2,
          },
          {
            id: "job-interview-basics-1-e2",
            prompt: "She ___ this company since 2020.",
            options: ["works for", "worked for", "has worked for", "working for"],
            correctIndex: 2,
          },
          {
            id: "job-interview-basics-1-e3",
            prompt: "What ___ your biggest strength?",
            options: ["is", "are", "was", "were"],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
];

/** Busca uma lição pelo id em qualquer unidade — os ids de lição são únicos no currículo. */
export function findLessonById(lessonId: string): Lesson | undefined {
  for (const unit of CURRICULUM) {
    const found = unit.lessons.find((lesson) => lesson.id === lessonId);
    if (found) return found;
  }
  return undefined;
}
