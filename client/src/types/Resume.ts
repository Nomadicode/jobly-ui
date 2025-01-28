
export type ResumeLink = {
    id?: string
    url: string
    type: string
}

export type ResumeSkill = {
    id: string
    name: string
    description: string
}

export type ResumeEducation = {
    id: string
    institution: string
    institutionDescription?: string
    degree: string
    fieldOfStudy: string
    startDate: string
    endDate?: string
    isPresent: boolean
    gpa?: number
    highlights?: string[]
    details?: string
}

export type ResumeWorkExperience = {
    id?: string
    companyName: string
    companyDescription?: string
    position: string
    location: string
    startDate: string
    endDate?: string
    isPresent: boolean
    highlights?: string[]
    details?: string
    skills?: ResumeSkill[]
}

export type ResumeProject = {
    id?: string
    title: string
    startDate: string
    endDate?: string
    projectUrl?: string
    highlights?: string[]
    details?: string
    relatedSkills?: ResumeSkill[]
}

export type ResumeVolunteer = {
    id?: string
    title: string
    organization: string
    organizationDescription?: string
    position: string
    location: string
    startDate: string
    endDate?: string
    isPresent: boolean
    highlights?: string[]
    details?: string
}

export type ResumeCertification = {
    id?: string
    name: string
    issuingOrganization: string
    issuingOrgDescription?: string
    issuingOrgUrl?: string
    issueDate: string
    expiryDate?: string
    credentialId?: string
    credentialUrl?: string
    details?: string
}

export type ResumeHonor = {
    id?: string
    name: string
    year: number
    details?: string
}

export type ResumeLanguage = {
    id?: string
    name: string
    proficiencyLevel: string
}

export type ResumeReference = {
    id?: string
    name: string
    title?: string
    company?: string
    email?: string
    phone?: string
    relationship: string
    details?: string
}

export type Resume = {
    id: string
    createdAt: string
    updatedAt: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    summary?: string
    location?: string
    profileLinks: ResumeLink[]
    interests: string[]
    highlights: string[]
    user: string
    skills: ResumeSkill[]
}