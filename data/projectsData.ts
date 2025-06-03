type Project = {
  title: string
  description: string
  imgSrc: string
  href: string
}

type ProjectsData = {
  [locale: string]: Project[]
}

const projectsData: ProjectsData = {
  en: [
    {
      title: 'CNC Mill Mk3',
      description: `I just wanted to build a PC case, but then everything changed...`,
      imgSrc: '/static/images/projects/cnc-mill-mk3.jpg',
      href: '/tags/cnc',
    },
  ],

  de: [
    {
      title: 'CNC-Fräse Mk3',
      description: `Eigetlich wollte ich doch nur ein PC-Case bauen, aber dann kam alles anders...`,
      imgSrc: '/static/images/projects/cnc-mill-mk3.jpg',
      href: '/blog/the-time-machine',
    },
  ],
}

export default projectsData
