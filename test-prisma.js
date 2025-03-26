const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Count students
  const studentCount = await prisma.user.count({
    where: { role: 'STUDENT' }
  })
  console.log(`Total students: ${studentCount}`)
  
  // 2. Count memory structures (story method and memory palace)
  const storyMethodNotes = await prisma.note.count({
    where: { mnemonicType: 'storyMethod' }
  })
  console.log(`Story Method notes: ${storyMethodNotes}`)
  
  const memoryPalaceNotes = await prisma.note.count({
    where: { mnemonicType: 'memoryPalace' }
  })
  console.log(`Memory Palace notes: ${memoryPalaceNotes}`)
  
  // 3. Check story node connections (linked list structure)
  const storyNodes = await prisma.storyNode.findMany({
    include: {
      memoryNode: true,
      nextNode: true
    }
  })
  
  // Group by previousNodeId to check linked list connections
  const connections = {}
  storyNodes.forEach(node => {
    if (node.previousNodeId) {
      connections[node.previousNodeId] = node.id
    }
  })
  
  console.log(`Story node connections: ${Object.keys(connections).length}`)
  
  // 4. Check memory palace structure
  const palaces = await prisma.palace.findMany({
    include: {
      rooms: {
        include: {
          palaceNodes: {
            include: {
              memoryNode: true
            }
          }
        }
      }
    }
  })
  
  console.log(`Memory palaces: ${palaces.length}`)
  
  // Print a sample of one palace with its rooms and nodes
  if (palaces.length > 0) {
    const samplePalace = palaces[0]
    console.log(`\nSample palace: ${samplePalace.name}`)
    console.log(`  Number of rooms: ${samplePalace.rooms.length}`)
    
    for (const room of samplePalace.rooms) {
      console.log(`\n  Room: ${room.name}`)
      console.log(`    Number of nodes: ${room.palaceNodes.length}`)
      
      for (const node of room.palaceNodes) {
        console.log(`    - Node: ${node.memoryNode.content.substring(0, 30)}...`)
      }
    }
  }
  
  // 5. Check overall note structure
  const studentWithNotes = await prisma.user.findFirst({
    where: { role: 'STUDENT' },
    include: {
      notes: {
        include: {
          memoryNodes: true
        }
      }
    }
  })
  
  if (studentWithNotes) {
    console.log(`\nSample student: ${studentWithNotes.name || studentWithNotes.email}`)
    console.log(`  Total notes: ${studentWithNotes.notes.length}`)
    
    // Count notes by type
    const noteTypes = {}
    studentWithNotes.notes.forEach(note => {
      const type = note.mnemonicType || 'regular'
      noteTypes[type] = (noteTypes[type] || 0) + 1
    })
    
    console.log('  Notes by mnemonic type:')
    Object.entries(noteTypes).forEach(([type, count]) => {
      console.log(`    - ${type}: ${count}`)
    })
    
    // Check links between notes and memory nodes
    const notesWithMemoryNodes = studentWithNotes.notes.filter(note => note.memoryNodes.length > 0)
    console.log(`  Notes with memory nodes: ${notesWithMemoryNodes.length}`)
  }
  
  // 6. Check classes and enrollments
  const classes = await prisma.class.findMany({
    include: {
      teacher: true,
      course: true,
      enrollments: {
        include: {
          user: true
        }
      },
      assignments: true
    }
  })
  
  console.log(`\nTotal classes: ${classes.length}`)
  
  // Print details for a sample class
  if (classes.length > 0) {
    const sampleClass = classes[0]
    console.log(`\nSample class: ${sampleClass.name}`)
    console.log(`  Course: ${sampleClass.course.title}`)
    console.log(`  Teacher: ${sampleClass.teacher.name || sampleClass.teacher.email}`)
    console.log(`  Class code: ${sampleClass.classCode}`)
    console.log(`  Enrolled students: ${sampleClass.enrollments.length}`)
    console.log(`  Assignments: ${sampleClass.assignments.length}`)
    
    // Print enrolled students for this class
    if (sampleClass.enrollments.length > 0) {
      console.log('\n  Enrolled students:')
      sampleClass.enrollments.slice(0, 5).forEach(enrollment => {
        console.log(`    - ${enrollment.user.name || enrollment.user.email} (${enrollment.status})`)
      })
      
      if (sampleClass.enrollments.length > 5) {
        console.log(`    - ... and ${sampleClass.enrollments.length - 5} more`)
      }
    }
    
    // Print assignments for this class
    if (sampleClass.assignments.length > 0) {
      console.log('\n  Assignments:')
      sampleClass.assignments.forEach(assignment => {
        console.log(`    - ${assignment.title} (due: ${assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'})`)
      })
    }
  }
  
  // Check student enrollments
  const studentWithClasses = await prisma.user.findFirst({
    where: { role: 'STUDENT' },
    include: {
      enrolledClasses: {
        include: {
          class: true
        }
      }
    }
  })
  
  if (studentWithClasses) {
    console.log(`\nSample student enrollments for ${studentWithClasses.name || studentWithClasses.email}:`)
    console.log(`  Total enrollments: ${studentWithClasses.enrolledClasses.length}`)
    
    studentWithClasses.enrolledClasses.forEach(enrollment => {
      console.log(`  - ${enrollment.class.name} (${enrollment.status})`)
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })