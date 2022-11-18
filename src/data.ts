export interface Department {
    id: number,
    name: string,
}

export interface Admin {
    id: number,
    name: string,
    department: Department,
}

export interface Task {
    id: number,
    name: string,
    level: number,
    environmental_survey: boolean,
    laboratory: boolean,
}

export const departments: Department[] = [
    {
        id: 0,
        name: `geotechnik`,
    },

    {
        id: 1,
        name: `bergbau`,
    },

    {
        id: 2,
        name: `umwelt`,
    },
]

export const admins: Admin[] = [
    {
        id: 0,
        name: `admin 1`,
        department: departments[0],
    },

    {
        id: 1,
        name: `admin 2`,
        department: departments[0],
    },

    {
        id: 2,
        name: `admin 3`,
        department: departments[0],
    },
]

export const tasks: Task[] = [

    {
        id: 0,
        name: `leitungsanfrage`,
        level: 1,
        environmental_survey: true,
        laboratory: true,
    },
    {
        id: 1,
        name: `leitungsanfrage`,
        level: 1,
        environmental_survey: false,
        laboratory: true,
    },
    {
        id: 2,
        name: `leitungsanfrage`,
        level: 1,
        environmental_survey: true,
        laboratory: false,
    },
    {
        id: 3,
        name: `leitungsanfrage`,
        level: 1,
        environmental_survey: false,
        laboratory: false,
    },

    {
        id: 4,
        name: `kampfmittelfreigabe`,
        level: 2,
        environmental_survey: true,
        laboratory: true,
    },
    {
        id: 5,
        name: `kampfmittelfreigabe`,
        level: 2,
        environmental_survey: true,
        laboratory: false,
    },
    {
        id: 6,
        name: `kampfmittelfreigabe`,
        level: 2,
        environmental_survey: false,
        laboratory: true,
    },
    {
        id: 7,
        name: `kampfmittelfreigabe`,
        level: 2,
        environmental_survey: false,
        laboratory: false,
    },

    {
        id: 8,
        name: `baugrunderkundungstermin`,
        level: 3,
        environmental_survey: true,
        laboratory: true,
    },
    {
        id: 9,
        name: `baugrunderkundungstermin`,
        level: 3,
        environmental_survey: true,
        laboratory: false,
    },
    {
        id: 10,
        name: `baugrunderkundungstermin`,
        level: 3,
        environmental_survey: false,
        laboratory: true,
    },
    {
        id: 11,
        name: `baugrunderkundungstermin`,
        level: 3,
        environmental_survey: false,
        laboratory: false,
    },

    {
        id: 12,
        name: `feldprotokolle auftragen`,
        level: 4,
        environmental_survey: true,
        laboratory: true,
    },
    {
        id: 13,
        name: `feldprotokolle auftragen`,
        level: 4,
        environmental_survey: true,
        laboratory: false,
    },
    {
        id: 14,
        name: `feldprotokolle auftragen`,
        level: 4,
        environmental_survey: false,
        laboratory: true,
    },
    {
        id: 15,
        name: `feldprotokolle auftragen`,
        level: 4,
        environmental_survey: false,
        laboratory: false,
    },

    {
        id: 16,
        name: `probe lieferung`,
        level: 5,
        environmental_survey: true,
        laboratory: true,
    },
    {
        id: 17,
        name: `probe lieferung`,
        level: 5,
        environmental_survey: true,
        laboratory: false,
    },
    {
        id: 18,
        name: `probe lieferung`,
        level: 5,
        environmental_survey: false,
        laboratory: true,
    },
    {
        id: 19,
        name: `probe lieferung`,
        level: 5,
        environmental_survey: false,
        laboratory: false,
    },

    {
        id: 20,
        name: `bodenansprache`,
        level: 6,
        environmental_survey: false,
        laboratory: true,
    },
    {
        id: 21,
        name: `bodenansprache`,
        level: 6,
        environmental_survey: false,
        laboratory: false,
    },
    {
        id: 22,
        name: `bodenansprache mit umwelt`,
        level: 6,
        environmental_survey: true,
        laboratory: false,
    },
    {
        id: 23,
        name: `bodenansprache mit umwelt`,
        level: 6,
        environmental_survey: true,
        laboratory: true,
    },

    {
        id: 24,
        name: `probenahme für labor`,
        level: 7,
        environmental_survey: false,
        laboratory: true,
    },
    {
        id: 25,
        name: `probenahme für umwelt`,
        level: 7,
        environmental_survey: true,
        laboratory: false,
    },
    {
        id: 26,
        name: `unterlagen vorbereitung`,
        level: 7,
        environmental_survey: false,
        laboratory: false,
    },
    {
        id: 27,
        name: `probenahme für labor und umwelt`,
        level: 7,
        environmental_survey: true,
        laboratory: true,
    },

    {
        id: 28,
        name: `unterlagen vorbereitung`,
        level: 8,
        environmental_survey: false,
        laboratory: true,
    },
    {
        id: 29,
        name: `bericht`,
        level: 8,
        environmental_survey: false,
        laboratory: false,
    },
    {
        id: 30,
        name: `unterlagen vorbereitung`,
        level: 8,
        environmental_survey: true,
        laboratory: false,
    },
    {
        id: 31,
        name: `unterlagen vorbereitung`,
        level: 8,
        environmental_survey: true,
        laboratory: true,
    },

    {
        id: 32,
        name: `bericht`,
        level: 9,
        environmental_survey: true,
        laboratory: true,
    },
    {
        id: 33,
        name: `bericht`,
        level: 9,
        environmental_survey: true,
        laboratory: false,
    },
    {
        id: 34,
        name: `bericht`,
        level: 9,
        environmental_survey: false,
        laboratory: true,
    },
    {
        id: 35,
        name: `bericht`,
        level: 9,
        environmental_survey: false,
        laboratory: false,
    },
]