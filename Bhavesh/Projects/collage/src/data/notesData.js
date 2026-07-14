export const semestersData = {
  sem1: {
    id: 'sem1',
    name: 'Semester 1',
    subjects: [
      {
        id: 'computer',
        name: 'Computer',
        image: '/com.jpg',
        colorClass: 'color-computer',
        notes: [
          { title: '1. C ALL notes 1,2,3 Merged', file: '/cin1.pdf' },
          { title: '2. Previous Year Full Book', file: '/pc.pdf' },
          { title: '!!! 70 IMP QUES !!!', file: '/70 CF&P Updated Importnt question (1)BCA.pdf' }
        ]
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        image: '/chem.jpg',
        colorClass: 'color-chemistry',
        notes: [
          { title: '1. Corrosion', file: '/co.pdf' },
          { title: '1. Corrosion part 2', file: '/U2[CORROSION].pdf' },
          { title: '2. Lubricants', file: '/lc.pdf' },
          { title: '2. Engineering Materials one shot', file: '/U1[Engineering Materials].pdf' },
          { title: '3. Water + Boiler Troubles', file: '/ce1.pdf' },
          { title: '4. Fuel', file: '/chemfuel.pdf' },
          { title: '5. Green Chemistry', file: '/g.docx' },
          { title: '6. All Unit 1', file: '/CHEMISTRY UNIT 1.pdf' },
          { title: '7. All Unit 2', file: '/CHEMISTRY UNIT 2.pdf' },
          { title: '8. All Unit 3', file: '/CHEMISTRY UNIT 3.pdf' },
          { title: '9. All Unit 4', file: '/CHEMISTRY UNIT 4.pdf' },
          { title: '10. All Unit 5', file: '/CHEMISTRY UNIT 5.pdf' },
          { title: '!!! IMP QUES 70 QUES !!!', file: '/Engg. Chemistry Imp. 70 question (1).docx' },
          { title: '!!! PYQ Practice !!!', file: '/CIT-PYQ-2023-24.pdf' }
        ]
      },
      {
        id: 'maths',
        name: 'Maths',
        image: '/math.jpg',
        colorClass: 'color-maths',
        notes: [
          { title: '1. Mathematics 1', file: '/ma111.pdf' },
          { title: '2. Maths Full Book Answers', file: '/f.pdf' },
          { title: '3. Maths Assignment', file: 'https://acrobat.adobe.com/id/urn:aaid:sc:AP:9c2918d3-b1b4-4410-9ddf-2162308daee1', isExternal: true },
          { title: '3. Maths Assignment Answers', file: '/mi.pdf' },
          { title: '3. Maths 10 Minutes Revision', file: '/Mathsimp.pdf' }
        ]
      },
      {
        id: 'bee',
        name: 'BEE',
        image: '/bee.jpg',
        colorClass: 'color-bee',
        notes: [
          { title: '1. 1st Chapter in Normal Handwritten', file: '/bee.pdf.docx.pdf' },
          { title: '2. 2nd Chapter in Normal Handwritten', file: '/bee2.docx.pdf' },
          { title: '3. 3rd Chapter in Normal Handwritten', file: '/3b.pdf' },
          { title: '4. 4th Chapter in Normal Handwritten', file: '/4b.pdf' },
          { title: '5. Important Notes', file: '/imp.pdf' },
          { title: '6. All Syllabus Notes', file: '/Bee Full syllabus.pdf' }
        ]
      },
      {
        id: 'mefa',
        name: 'MEFA',
        image: '/mefa.jpg',
        colorClass: 'color-mefa',
        notes: [
          { title: '1. 1st Chapter Sir wala', file: '/mefa1.docx' },
          { title: '1.1 1st Chapter Sir wala (Part 2)', file: '/mefa1p.docx' },
          { title: '2. 2nd Chapter Sir wala', file: '/mefa2.docx' },
          { title: '3. Cost', file: '/cost.pdf.docx' },
          { title: '3. Unit 3 Production', file: '/m3p.docx' },
          { title: '4. 4th Chapter Sir wala', file: '/m4.docx' },
          { title: '5. 5th Chapter Sir wala', file: '/m51.docx' },
          { title: '5. Part 2 Chapter 5', file: '/m52.docx' },
          { title: '5. Part 3 Chapter 5', file: '/m53.docx' },
          { title: '5. Part 4 Chapter 5', file: '/m54.docx' },
          { title: '!!! MEFA IMP 70 QUES !!!', file: '/MEFA_imp_Q & A_Merged.pdf' }
        ]
      },
      {
        id: 'practical',
        name: 'Practical',
        image: '/p.jpg',
        colorClass: 'color-practical',
        secured: true,
        notes: [
          {
            title: 'Computer Fundamentals Practicals',
            subnotes: [
              { title: '1. Normal Pdf Sir wala', file: '/c.pdf.docx' },
              { title: '2. Handwritten', file: '/ch1.pdf' }
            ]
          },
          {
            title: 'Chemistry Practicals',
            subnotes: [
              { title: '1. Experiment 1 to 4 in Normal Handwritten', file: '/chemq.pdf.docx' },
              { title: '2. Alternate File (Communication File)', file: '/chamq.pdf' }
            ]
          },
          {
            title: 'Communication Practicals',
            subnotes: [
              { title: '1. FULL FILE Normal Handwritten', file: '/commu.pdf' },
              { title: '2. Communication File', file: '/chamq.pdf' }
            ]
          },
          {
            title: 'BEE Practicals',
            subnotes: [
              { title: '1. BEE file', file: '/beep.pdf' },
              { title: '2. Practical 1 to 4 Handwritten', file: '/beep.pdf.docx' }
            ]
          }
        ]
      },
      {
        id: 'midsem',
        name: 'Mid-Sem',
        image: '/t.jpg',
        colorClass: 'color-midsem',
        notes: [
          { title: '1. 1st Mid Term 2025–26', file: '/1midsemp.pdf' },
          { title: '2. 2nd Mid Term 2025–26', file: '/smid.pdf' },
          { title: '3. Pre-University-Exam 2025–26', file: '/All.pdf' }
        ]
      }
    ]
  },
  sem2: {
    id: 'sem2',
    name: 'Semester 2',
    subjects: [
      {
        id: 'comm_skills',
        name: 'Communication Skills',
        image: '/commu.jpg',
        colorClass: 'color-comm_skills',
        notes: [
          { title: '70 IMP + All Syllabus', file: '/2ndseminpcomm.pdf' }
        ]
      },
      {
        id: 'built_env',
        name: 'Built Environment',
        image: '/chem.jpg',
        colorClass: 'color-built_env',
        notes: [
          { title: 'Unit 1 - Notes', file: '/UNIT-1 NOTES.pdf' },
          { title: 'Unit 2, 3, 4 Merge', file: '/UNIT 3,2,4.pdf.pdf' }
        ]
      },
      {
        id: 'physics',
        name: 'Physics',
        image: '/bee.jpg',
        colorClass: 'color-physics',
        notes: [
          { title: '70 IMP and Full syllabus', file: '/PhysicsIMP.pdf' },
          { title: 'Previous Year Questions', file: '/PYQ Physics.pdf' },
          { title: 'Unit 1 - Wave Optics', file: '/UNIT-1(WAVE OPTICS).pdf' },
          { title: 'Unit 2', file: '/PHYSICS U2.pdf' },
          { title: 'Unit 3 - Laser', file: '/UNIT-3(LASER).pdf' },
          { title: 'Unit 4 - Semiconductors', file: '/UNIT-4(SEMICONDUUCTORS).pdf' },
          { title: 'Unit 5 - Electromagnetism', file: '/UNIT-5(INTRO TO ELECTROMAGNETISM).pdf' }
        ]
      },
      {
        id: 'maths2',
        name: 'Maths',
        image: '/math.jpg',
        colorClass: 'color-maths2',
        notes: []
      },
      {
        id: 'mech_eng',
        name: 'Mechanical Engineering',
        image: '/com.jpg',
        colorClass: 'color-mech_eng',
        notes: [
          { title: 'Unit 1 - Notes', file: '/EME- UNIT 01.pdf' },
          { title: 'Unit 2 - (Not uploaded yet)', file: '#', isPlaceholder: true },
          { title: 'Unit 3', file: '/EME UNIT - III.pdf' },
          { title: 'Unit 4', file: '/EME Unit-IV.pdf' },
          { title: 'Unit 5', file: '/EME-UNIT-5.pdf' }
        ]
      }
    ]
  },
  sem3: { id: 'sem3', name: 'Semester 3', subjects: [] },
  sem4: { id: 'sem4', name: 'Semester 4', subjects: [] },
  sem5: { id: 'sem5', name: 'Semester 5', subjects: [] },
  sem6: { id: 'sem6', name: 'Semester 6', subjects: [] },
  sem7: { id: 'sem7', name: 'Semester 7', subjects: [] },
  sem8: { id: 'sem8', name: 'Semester 8', subjects: [] }
};
