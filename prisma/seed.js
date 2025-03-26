const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/lib/auth');

const prisma = new PrismaClient();

async function main() {
  // Create users with different roles
  const testUsers = [
    { email: 'parent@example.com', name: 'Test Parent', password: 'test123', role: 'PARENT' },
    { email: 'admin@example.com', name: 'Test Admin', password: 'test123', role: 'ADMIN' },
    { email: 'staff@school.org', name: 'Rebecca Martinez', password: 'test123', role: 'STAFF' },
  ];

  // Create teachers
  const teachers = [
    { email: 'math.teacher@school.org', name: 'Dr. Emma Johnson', password: 'test123', role: 'TEACHER', subjects: ['Algebra I', 'Algebra II'] },
    { email: 'geometry.teacher@school.org', name: 'Prof. Michael Chen', password: 'test123', role: 'TEACHER', subjects: ['Geometry'] },
    { email: 'chemistry.teacher@school.org', name: 'Dr. Sarah Williams', password: 'test123', role: 'TEACHER', subjects: ['Chemistry'] },
  ];

  // Create users and store them by role
  const users = {};
  
  // Create regular test users
  for (const userData of testUsers) {
    const { email, name, password, role } = userData;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const hashedPassword = await hashPassword(password);
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role,
        },
      });
      console.log(`Created ${role} user:`, user.name);
    } else {
      console.log(`${role} user already exists:`, user.name);
    }

    users[role] = user;
  }
  
  // Create teacher users
  const teacherUsers = {};
  for (const teacherData of teachers) {
    const { email, name, password, role, subjects } = teacherData;

    let teacher = await prisma.user.findUnique({
      where: { email },
    });

    if (!teacher) {
      const hashedPassword = await hashPassword(password);
      teacher = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role,
        },
      });
      console.log(`Created ${role} user:`, teacher.name);
    } else {
      console.log(`${role} user already exists:`, teacher.name);
    }

    teacherUsers[email] = { user: teacher, subjects };
  }

  // Create courses
  const courses = [
    {
      title: 'Algebra I',
      slug: 'algebra-i',
      description: 'Introduction to algebraic concepts and problem-solving techniques aligned with NYSED standards',
      teacherEmail: 'math.teacher@school.org',
    },
    {
      title: 'Algebra II',
      slug: 'algebra-ii',
      description: 'Advanced algebraic concepts including functions, equations, and applications',
      teacherEmail: 'math.teacher@school.org',
    },
    {
      title: 'Geometry',
      slug: 'geometry',
      description: 'Study of geometric concepts, proofs, and spatial relationships',
      teacherEmail: 'geometry.teacher@school.org',
    },
    {
      title: 'Chemistry',
      slug: 'chemistry',
      description: 'Study of matter, its properties, and the changes it undergoes',
      teacherEmail: 'chemistry.teacher@school.org',
    },
  ];

  const courseEntities = {};
  const bookEntities = {};

  // Create courses and their books
  for (const courseData of courses) {
    const { title, slug, description, teacherEmail } = courseData;
    
    let course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      course = await prisma.course.create({
        data: {
          title,
          description,
          slug,
        },
      });
      console.log(`Created course: ${title}`);
    } else {
      console.log(`Course already exists: ${title}`);
    }
    
    courseEntities[slug] = course;
    
    // Create the main book for each course
    const bookTitle = `${title}: NYSED Standards Edition`;
    const bookSlug = `${slug}-standards`;
    
    let book = await prisma.book.findUnique({
      where: { slug: bookSlug },
    });
    
    if (!book) {
      book = await prisma.book.create({
        data: {
          title: bookTitle,
          description: `Comprehensive guide to ${title} aligned with New York State Education Department standards`,
          slug: bookSlug,
          course: {
            connect: { id: course.id },
          },
        },
      });
      console.log(`Created book: ${bookTitle}`);
    } else {
      console.log(`Book already exists: ${bookTitle}`);
    }
    
    bookEntities[bookSlug] = book;
  }

  // Create class sections with codes
  const classes = [
    { 
      name: 'Algebra I - Period 1', 
      courseSlug: 'algebra-i', 
      classCode: 'ALG1-P1-2025', 
      teacherEmail: 'math.teacher@school.org',
      academicYear: '2024-2025',
      term: 'Fall',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-01-31'),
      gradeLevel: '9th Grade',
      subject: 'Mathematics',
      enrollmentCode: 'ALG1P125',
      studentsEnrolled: 22,
      averageScore: 83
    },
    { 
      name: 'Algebra I - Period 3', 
      courseSlug: 'algebra-i', 
      classCode: 'ALG1-P3-2025', 
      teacherEmail: 'math.teacher@school.org',
      academicYear: '2024-2025',
      term: 'Fall',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-01-31'),
      gradeLevel: '9th Grade',
      subject: 'Mathematics',
      enrollmentCode: 'ALG1P325',
      studentsEnrolled: 24,
      averageScore: 79
    },
    { 
      name: 'Algebra II - Period 4', 
      courseSlug: 'algebra-ii', 
      classCode: 'ALG2-P4-2025', 
      teacherEmail: 'math.teacher@school.org',
      academicYear: '2024-2025',
      term: 'Spring',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-06-15'),
      gradeLevel: '10th Grade',
      subject: 'Mathematics',
      enrollmentCode: 'ALG2P425',
      studentsEnrolled: 18,
      averageScore: 85
    },
    { 
      name: 'Geometry - Period 2', 
      courseSlug: 'geometry', 
      classCode: 'GEO-P2-2025', 
      teacherEmail: 'geometry.teacher@school.org',
      academicYear: '2024-2025',
      term: 'Fall',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-01-31'),
      gradeLevel: '10th Grade',
      subject: 'Mathematics',
      enrollmentCode: 'GEOP225',
      studentsEnrolled: 20,
      averageScore: 81
    },
    { 
      name: 'Geometry - Period 5', 
      courseSlug: 'geometry', 
      classCode: 'GEO-P5-2025', 
      teacherEmail: 'geometry.teacher@school.org',
      academicYear: '2024-2025',
      term: 'Spring',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-06-15'),
      gradeLevel: '10th Grade',
      subject: 'Mathematics',
      enrollmentCode: 'GEOP525',
      studentsEnrolled: 23,
      averageScore: 80
    },
    { 
      name: 'Chemistry - Period 1', 
      courseSlug: 'chemistry', 
      classCode: 'CHEM-P1-2025', 
      teacherEmail: 'chemistry.teacher@school.org',
      academicYear: '2024-2025',
      term: 'Fall',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-01-31'),
      gradeLevel: '11th Grade',
      subject: 'Science',
      enrollmentCode: 'CHEMP125',
      studentsEnrolled: 19,
      averageScore: 78
    },
    { 
      name: 'Chemistry - Period 6', 
      courseSlug: 'chemistry', 
      classCode: 'CHEM-P6-2025', 
      teacherEmail: 'chemistry.teacher@school.org',
      academicYear: '2024-2025',
      term: 'Spring',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-06-15'),
      gradeLevel: '11th Grade',
      subject: 'Science',
      enrollmentCode: 'CHEMP625',
      studentsEnrolled: 21,
      averageScore: 76
    },
  ];
  
  const classEntities = {};
  
  for (const classData of classes) {
    const { name, courseSlug, classCode, teacherEmail, academicYear, term, startDate, endDate, gradeLevel, subject, enrollmentCode, studentsEnrolled, averageScore } = classData;
    const course = courseEntities[courseSlug];
    const teacher = teacherUsers[teacherEmail].user;
    
    let classEntity = await prisma.class.findUnique({
      where: { classCode },
    });
    
    if (!classEntity) {
      classEntity = await prisma.class.create({
        data: {
          name,
          classCode,
          academicYear,
          term,
          startDate,
          endDate,
          course: {
            connect: { id: course.id }
          },
          teacher: {
            connect: { id: teacher.id }
          }
        },
      });
      console.log(`Created class: ${name} with code ${classCode}`);
    } else {
      console.log(`Class already exists: ${name} with code ${classCode}`);
    }
    
    // Add the custom fields as metadata
    classEntity.gradeLevel = gradeLevel;
    classEntity.subject = subject;
    classEntity.enrollmentCode = enrollmentCode;
    classEntity.studentsEnrolled = studentsEnrolled;
    classEntity.averageScore = averageScore;
    classEntity.activeStudents = Math.floor(studentsEnrolled * 0.85);
    classEntity.lastActive = new Date();
    classEntity.createdAt = new Date();
    classEntity.knowledgeRetention = Math.floor(70 + Math.random() * 20); // 70-90%
    classEntity.collegeReadiness = Math.floor(65 + Math.random() * 25); // 65-90%
    classEntity.projectedSAT = Math.floor(1150 + Math.random() * 300); // 1150-1450
    classEntity.projectedACT = Math.floor(22 + Math.random() * 10); // 22-32
    
    classEntities[classCode] = classEntity;
  }

  // Define chapter content for each course
  const chapterContent = {
    'algebra-i-standards': [
      {
        title: 'Chapter 1: Variables and Expressions',
        order: 1,
        description: 'Introduction to variables, expressions, and basic algebraic operations',
        sections: [
          {
            title: '1.1 Introduction to Variables',
            order: 1,
            description: 'Understanding the concept of variables in algebra',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "Algebra uses symbols, usually letters, to represent numbers whose values are not yet known. These symbols are called variables because their values can vary."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "Variables allow us to write general mathematical statements. For example, the area of a rectangle can be written as A = l × w, where l is the length and w is the width."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Variables in Formulas',
                caption: 'Common mathematical formulas using variables',
                imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                // This shows a chalkboard with mathematical formulas
              },
              {
                type: 'exercise',
                order: 4,
                content: "Identify the variables in the formula P = 2l + 2w.",
                difficultyLevel: 'easy',
                type: 'multiple-choice',
                solution: "The variables are l (length) and w (width). P represents perimeter."
              },
              {
                type: 'exercise',
                order: 5,
                content: "Write an expression for the area of a circle with radius r.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "A = πr²"
              }
            ]
          },
          {
            title: '1.2 Algebraic Expressions',
            order: 2,
            description: 'Creating and simplifying algebraic expressions',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "An algebraic expression is a combination of variables, numbers, and operations. Examples include 3x + 2, y² - 5y, and 2(a + b)."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "Terms in an expression are separated by addition or subtraction operations. In 3x + 2, the terms are 3x and 2."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Parts of an Expression',
                caption: 'The components of an algebraic expression',
                imageUrl: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                // This shows a notebook with algebraic expressions
              },
              {
                type: 'exercise',
                order: 4,
                content: "Identify the terms in the expression 5x² - 3x + 7.",
                difficultyLevel: 'easy',
                type: 'multiple-choice',
                solution: "The terms are 5x², -3x, and 7."
              },
              {
                type: 'exercise',
                order: 5,
                content: "Simplify the expression 3(x + 2) - 2(x - 1).",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "3(x + 2) - 2(x - 1) = 3x + 6 - 2x + 2 = x + 8"
              }
            ]
          }
        ]
      },
      {
        title: 'Chapter 2: Equations and Inequalities',
        order: 2,
        description: 'Solving linear equations and inequalities',
        sections: [
          {
            title: '2.1 Linear Equations',
            order: 1,
            description: 'Solving one-step and multi-step linear equations',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "A linear equation is an equation where each term is either a constant or the product of a constant and a variable raised to the first power."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "To solve a linear equation, we isolate the variable by performing the same operations on both sides of the equation."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Solving Linear Equations',
                caption: 'Step-by-step process for solving linear equations',
                imageUrl: 'https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                // This shows a student solving equations on paper
              },
              {
                type: 'exercise',
                order: 4,
                content: "Solve the equation 3x + 5 = 14.",
                difficultyLevel: 'easy',
                type: 'problem-solving',
                solution: "3x + 5 = 14\n3x = 9\nx = 3"
              },
              {
                type: 'exercise',
                order: 5,
                content: "Solve the equation 2(x - 3) = 4x - 10.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "2(x - 3) = 4x - 10\n2x - 6 = 4x - 10\n-2x = -4\nx = 2"
              }
            ]
          },
          {
            title: '2.2 Linear Inequalities',
            order: 2,
            description: 'Solving and graphing linear inequalities',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "A linear inequality is similar to a linear equation but uses inequality symbols (<, >, ≤, ≥) instead of an equals sign."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "When solving inequalities, remember that multiplying or dividing both sides by a negative number reverses the inequality symbol."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Inequality Graphs',
                caption: 'Graphs of different types of inequalities on a number line',
                imageUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Solve the inequality 2x - 3 > 5.",
                difficultyLevel: 'easy',
                type: 'problem-solving',
                solution: "2x - 3 > 5\n2x > 8\nx > 4"
              },
              {
                type: 'exercise',
                order: 5,
                content: "Solve the inequality -3(x + 2) ≤ 6 and graph the solution on a number line.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "-3(x + 2) ≤ 6\n-3x - 6 ≤ 6\n-3x ≤ 12\nx ≥ -4\nThe solution is graphed on a number line with a closed circle at -4 extending to the right."
              }
            ]
          }
        ]
      }
    ],
    'algebra-ii-standards': [
      {
        title: 'Chapter 1: Functions and Their Graphs',
        order: 1,
        description: 'Understanding and analyzing various types of functions',
        sections: [
          {
            title: '1.1 Function Basics',
            order: 1,
            description: 'Definition, notation, and evaluation of functions',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "A function is a rule that assigns to each input exactly one output. We often use the notation f(x) to represent the output when the input is x."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "The domain of a function is the set of all possible input values. The range is the set of all possible output values."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Function Notation',
                caption: 'Examples of functions written in different forms',
                imageUrl: '/images/algebra2/function-notation.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Evaluate f(x) = 2x² - 3x + 1 when x = 2.",
                difficultyLevel: 'easy',
                type: 'problem-solving',
                solution: "f(2) = 2(2)² - 3(2) + 1 = 2(4) - 6 + 1 = 8 - 6 + 1 = 3"
              },
              {
                type: 'exercise',
                order: 5,
                content: "Find the domain of f(x) = 3/(x - 4).",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "The domain is all real numbers except x = 4, since division by zero is undefined. In set notation: {x | x ≠ 4}."
              }
            ]
          },
          {
            title: '1.2 Transformations of Functions',
            order: 2,
            description: 'Shifting, stretching, and reflecting functions',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "Function transformations allow us to graph functions by applying operations to a parent function. Common transformations include shifts, stretches, and reflections."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "For f(x) = a·g(b(x - h)) + k: |a| stretches the graph vertically, b stretches it horizontally, (h, k) shifts the graph, and a < 0 reflects the graph over the x-axis."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Function Transformations',
                caption: 'Examples of various function transformations',
                imageUrl: '/images/algebra2/transformations.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Describe the transformation of f(x) = (x - 3)² + 2 compared to g(x) = x².",
                difficultyLevel: 'easy',
                type: 'multiple-choice',
                solution: "The function f(x) is g(x) shifted right 3 units and up 2 units."
              },
              {
                type: 'exercise',
                order: 5,
                content: "Graph f(x) = -2|x + 1| - 3 starting from the parent function g(x) = |x|.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "Starting with g(x) = |x|, shift left 1 unit to get |x + 1|, stretch vertically by a factor of 2 and reflect over the x-axis to get -2|x + 1|, then shift down 3 units."
              }
            ]
          }
        ]
      },
      {
        title: 'Chapter 2: Polynomial Functions',
        order: 2,
        description: 'Working with quadratic, cubic, and higher-degree polynomials',
        sections: [
          {
            title: '2.1 Quadratic Functions',
            order: 1,
            description: 'Analysis and applications of quadratic functions',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "A quadratic function has the form f(x) = ax² + bx + c, where a ≠ 0. Its graph is a parabola that opens upward if a > 0 and downward if a < 0."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "The vertex form of a quadratic function is f(x) = a(x - h)² + k, where (h, k) is the vertex of the parabola."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Quadratic Function Features',
                caption: 'The vertex, axis of symmetry, and other features of a parabola',
                imageUrl: '/images/algebra2/quadratic.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Find the vertex of the quadratic function f(x) = 2x² - 8x + 7.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "To find the vertex, we need to convert to vertex form or use the formula x = -b/(2a).\nx = -(-8)/(2·2) = 8/4 = 2\nf(2) = 2(2)² - 8(2) + 7 = 2(4) - 16 + 7 = 8 - 16 + 7 = -1\nThe vertex is (2, -1)."
              },
              {
                type: 'exercise',
                order: 5,
                content: "Solve the quadratic equation 3x² - 5x - 2 = 0 using the quadratic formula.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "Using the quadratic formula, x = (-b ± √(b² - 4ac))/(2a) with a = 3, b = -5, c = -2.\nx = (5 ± √(25 + 24))/(2·3) = (5 ± √49)/6 = (5 ± 7)/6\nx = 2 or x = -1/3"
              }
            ]
          },
          {
            title: '2.2 Polynomial Functions of Higher Degree',
            order: 2,
            description: 'Analyzing cubic and higher-degree polynomial functions',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "A polynomial function of degree n has the form f(x) = anx^n + an-1x^(n-1) + ... + a1x + a0, where an ≠ 0 and n is a non-negative integer."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "The end behavior of a polynomial function depends on the leading term. If the degree is even, both ends go in the same direction. If odd, they go in opposite directions."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Polynomial Behavior',
                caption: 'Graphs of different polynomial functions showing various behaviors',
                imageUrl: '/images/algebra2/polynomials.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Determine the end behavior of f(x) = -2x³ + 5x² - x + 3.",
                difficultyLevel: 'easy',
                type: 'multiple-choice',
                solution: "The leading term is -2x³. Since the degree is odd (3) and the coefficient is negative, as x → ∞, f(x) → -∞, and as x → -∞, f(x) → ∞."
              },
              {
                type: 'exercise',
                order: 5,
                content: "Find all zeros of the polynomial function f(x) = x³ - 4x² + x + 6.",
                difficultyLevel: 'hard',
                type: 'problem-solving',
                solution: "We need to find values of x for which f(x) = 0.\nFirst, try some potential rational zeros using the rational zeros theorem.\nWhen x = -1: f(-1) = (-1)³ - 4(-1)² + (-1) + 6 = -1 - 4 - 1 + 6 = 0, so x = -1 is a zero.\nWe can now factor: f(x) = (x+1)(x² - 5x + 6) = (x+1)(x-2)(x-3)\nThe zeros are x = -1, x = 2, and x = 3."
              }
            ]
          }
        ]
      }
    ],
    'geometry-standards': [
      {
        title: 'Chapter 1: Foundations of Geometry',
        order: 1,
        description: 'Basic concepts, points, lines, planes, and coordinate systems',
        sections: [
          {
            title: '1.1 Basic Geometric Concepts',
            order: 1,
            description: 'Understanding points, lines, planes, and basic postulates',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "Geometry is built upon three undefined terms: point, line, and plane. A point has no dimension, a line is one-dimensional, and a plane is two-dimensional."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "Points are typically labeled with uppercase letters (A, B, C), lines with lowercase letters (l, m, n) or two points (AB), and planes with script letters or names (plane P)."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Basic Geometric Elements',
                caption: 'Points, lines, and planes in geometry',
                imageUrl: '/images/geometry/basic-elements.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "What is the minimum number of points needed to determine a unique line? A unique plane?",
                difficultyLevel: 'easy',
                type: 'multiple-choice',
                solution: "A unique line is determined by exactly 2 points. A unique plane is determined by exactly 3 non-collinear points."
              },
              {
                type: 'exercise',
                order: 5,
                content: "If points A, B, and C are collinear, and points B, C, and D are collinear, must all four points be collinear? Justify your answer.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "Yes, all four points must be collinear. Since points A, B, and C lie on a line, and points B, C, and D lie on a line, and two points (B and C) are shared between these sets, there can only be one line containing B and C. Therefore, points A, B, C, and D all lie on the same line."
              }
            ]
          },
          {
            title: '1.2 Angles and Their Measure',
            order: 2,
            description: 'Understanding angle types, measurement, and relationships',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "An angle is formed by two rays with a common endpoint called the vertex. Angles are measured in degrees or radians."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "Angles can be classified by their measure: acute (less than 90°), right (exactly 90°), obtuse (between 90° and 180°), and straight (exactly 180°)."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Types of Angles',
                caption: 'Classifications of angles based on their measure',
                imageUrl: '/images/geometry/angle-types.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Classify the angle with measure 135° as acute, right, obtuse, or straight.",
                difficultyLevel: 'easy',
                type: 'multiple-choice',
                solution: "An angle of 135° is obtuse because it is between 90° and 180°."
              },
              {
                type: 'exercise',
                order: 5,
                content: "If two angles are complementary and one angle measures 37°, what is the measure of the other angle?",
                difficultyLevel: 'easy',
                type: 'problem-solving',
                solution: "Complementary angles sum to 90°. If one angle is 37°, then the other angle is 90° - 37° = 53°."
              }
            ]
          }
        ]
      },
      {
        title: 'Chapter 2: Triangles and Congruence',
        order: 2,
        description: 'Properties of triangles and congruence relationships',
        sections: [
          {
            title: '2.1 Triangle Classification',
            order: 1,
            description: 'Types of triangles and their properties',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "Triangles can be classified by their angles: acute (all angles acute), right (one right angle), or obtuse (one obtuse angle)."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "Triangles can also be classified by their sides: scalene (no equal sides), isosceles (at least two equal sides), or equilateral (all sides equal)."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Triangle Classifications',
                caption: 'Different types of triangles based on sides and angles',
                imageUrl: '/images/geometry/triangle-types.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Classify the triangle with sides of lengths 3, 4, and 5 by both its angles and sides.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "The triangle with sides 3, 4, and 5 is a right triangle because it satisfies the Pythagorean theorem: 3² + 4² = 5². It is also a scalene triangle because all three sides have different lengths."
              },
              {
                type: 'exercise',
                order: 5,
                content: "If a triangle has an angle of 100°, what type of triangle is it based on its angles?",
                difficultyLevel: 'easy',
                type: 'multiple-choice',
                solution: "The triangle is an obtuse triangle because it has one angle greater than 90° (in this case, 100°)."
              }
            ]
          },
          {
            title: '2.2 Triangle Congruence',
            order: 2,
            description: 'Congruence postulates and proving triangles congruent',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "Two triangles are congruent if they have the same size and shape. Congruent triangles have corresponding angles and sides that are equal."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "There are several triangle congruence postulates: SSS (three pairs of equal sides), SAS (two pairs of equal sides and the included angle), ASA (two pairs of equal angles and the included side), and AAS (two pairs of equal angles and a non-included side)."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Triangle Congruence Criteria',
                caption: 'Visual representation of the different congruence postulates',
                imageUrl: '/images/geometry/congruence-postulates.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Given that ∆ABC has sides AB = 5, BC = 7, and AC = 9, and ∆DEF has sides DE = 5, EF = 7, and DF = 9, prove that ∆ABC ≅ ∆DEF.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "We have AB = DE = 5, BC = EF = 7, and AC = DF = 9. Since all three pairs of corresponding sides are equal, the triangles are congruent by the SSS (Side-Side-Side) congruence postulate."
              },
              {
                type: 'exercise',
                order: 5,
                content: "Given that ∆PQR has ∠P = 45°, PQ = 8, and ∠Q = 60°, and ∆XYZ has ∠X = 45°, XY = 8, and ∠Y = 60°, prove that ∆PQR ≅ ∆XYZ.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "We have ∠P = ∠X = 45°, PQ = XY = 8, and ∠Q = ∠Y = 60°. Since two pairs of corresponding angles and the included side are equal, the triangles are congruent by the ASA (Angle-Side-Angle) congruence postulate."
              }
            ]
          }
        ]
      }
    ],
    'chemistry-standards': [
      {
        title: 'Chapter 1: Matter and Measurement',
        order: 1,
        description: 'Classification of matter, physical and chemical properties, measurements',
        sections: [
          {
            title: '1.1 Classification of Matter',
            order: 1,
            description: 'Understanding pure substances, mixtures, and states of matter',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "Matter is anything that has mass and occupies space. Matter exists in three states: solid, liquid, and gas. Some substances can also exist in a plasma state at high temperatures."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "Matter can be classified as pure substances (elements and compounds) or mixtures (homogeneous and heterogeneous). Elements cannot be broken down into simpler substances, while compounds contain two or more elements chemically combined."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Classification of Matter',
                caption: 'Flow chart showing the classification of matter into pure substances and mixtures',
                imageUrl: '/images/chemistry/matter-classification.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Classify each of the following as an element, compound, homogeneous mixture, or heterogeneous mixture: salt water, oxygen, granite, carbon dioxide.",
                difficultyLevel: 'medium',
                type: 'multiple-choice',
                solution: "Salt water: homogeneous mixture\nOxygen: element\nGranite: heterogeneous mixture\nCarbon dioxide: compound"
              },
              {
                type: 'exercise',
                order: 5,
                content: "Describe the difference between a homogeneous and heterogeneous mixture, and provide an example of each.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "A homogeneous mixture has a uniform composition throughout, meaning its components cannot be visually distinguished. Examples include solutions like salt dissolved in water or air.\n\nA heterogeneous mixture has varying composition throughout, with visually distinguishable components. Examples include Italian salad dressing (oil and vinegar), soil, and concrete."
              }
            ]
          },
          {
            title: '1.2 Properties and Changes of Matter',
            order: 2,
            description: 'Physical and chemical properties and changes in matter',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "Physical properties can be observed without changing the chemical composition of a substance. Examples include color, density, melting point, boiling point, and solubility."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "Chemical properties describe how a substance can change into a different substance. Examples include flammability, reactivity with acid, and ability to rust."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Physical vs. Chemical Changes',
                caption: 'Examples of physical and chemical changes in everyday life',
                imageUrl: '/images/chemistry/changes.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Identify each of the following as a physical or chemical change: water freezing, wood burning, milk souring, dissolving salt in water.",
                difficultyLevel: 'easy',
                type: 'multiple-choice',
                solution: "Water freezing: physical change\nWood burning: chemical change\nMilk souring: chemical change\nDissolving salt in water: physical change"
              },
              {
                type: 'exercise',
                order: 5,
                content: "Iron rusts when exposed to oxygen and water, forming iron oxide. Is this a physical or chemical change? Explain your reasoning.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "Rusting is a chemical change because a new substance (iron oxide) is formed with different chemical properties than the original iron. The chemical composition changes as iron atoms react with oxygen and water to form a new compound."
              }
            ]
          }
        ]
      },
      {
        title: 'Chapter 2: Atomic Structure and the Periodic Table',
        order: 2,
        description: 'Atomic theory, electron configuration, and periodic trends',
        sections: [
          {
            title: '2.1 Atomic Theory and Structure',
            order: 1,
            description: 'Development of atomic theory and structure of atoms',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "The modern atomic theory states that all matter is composed of atoms, which are the smallest particles of an element that retain its chemical properties. Atoms consist of a nucleus containing protons and neutrons, surrounded by electrons."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "Protons have a positive charge, electrons have a negative charge, and neutrons have no charge. The number of protons in an atom, called the atomic number, determines which element it is."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Atomic Structure',
                caption: 'Model of an atom showing the nucleus and electron cloud',
                imageUrl: '/images/chemistry/atomic-structure.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "An atom has 17 protons, 18 neutrons, and 17 electrons. What is the element's identity, mass number, and charge?",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "The identity of an element is determined by its atomic number, which is the number of protons (17). The element with 17 protons is chlorine (Cl).\nThe mass number is the sum of protons and neutrons: 17 + 18 = 35.\nThe charge is determined by comparing protons and electrons. Since there are 17 protons and 17 electrons, the atom is neutral (charge = 0).\nThis atom is Cl-35 with no charge."
              },
              {
                type: 'exercise',
                order: 5,
                content: "Draw the Bohr model for a lithium atom (atomic number 3).",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "A Bohr model for lithium would show a nucleus with 3 protons and 4 neutrons (most common isotope), surrounded by 2 electrons in the first energy level and 1 electron in the second energy level."
              }
            ]
          },
          {
            title: '2.2 The Periodic Table',
            order: 2,
            description: 'Organization and trends in the periodic table',
            content: [
              {
                type: 'paragraph',
                order: 1,
                content: "The periodic table organizes elements by increasing atomic number and groups elements with similar properties in columns (groups). The rows (periods) represent the number of electron shells."
              },
              {
                type: 'paragraph',
                order: 2,
                content: "Elements are categorized as metals, nonmetals, or metalloids based on their properties. Metals tend to be on the left and center of the table, nonmetals on the upper right, and metalloids between them."
              },
              {
                type: 'figure',
                order: 3,
                title: 'Periodic Table Regions',
                caption: 'Different regions and groupings of the periodic table',
                imageUrl: '/images/chemistry/periodic-table.png'
              },
              {
                type: 'exercise',
                order: 4,
                content: "Identify the group number, period number, and block for the element chlorine (Cl).",
                difficultyLevel: 'easy',
                type: 'multiple-choice',
                solution: "Chlorine (Cl) is in group 17 (or 7A in the old notation), period 3, and the p-block."
              },
              {
                type: 'exercise',
                order: 5,
                content: "Describe the trend in atomic radius as you move from left to right across a period in the periodic table. Explain why this trend occurs.",
                difficultyLevel: 'medium',
                type: 'problem-solving',
                solution: "Atomic radius generally decreases from left to right across a period. This occurs because as you move across a period, the number of protons increases while electrons are added to the same energy level. The increased nuclear charge pulls the electrons more tightly toward the nucleus, resulting in a smaller atomic radius."
              }
            ]
          }
        ]
      }
    ]
  };

  // Create chapters, sections, and content
  for (const [bookSlug, chapters] of Object.entries(chapterContent)) {
    const book = bookEntities[bookSlug];
    
    for (const chapter of chapters) {
      let chapterRecord = await prisma.chapter.findFirst({
        where: { 
          title: chapter.title,
          bookId: book.id 
        }
      });
      
      if (!chapterRecord) {
        chapterRecord = await prisma.chapter.create({
          data: {
            title: chapter.title,
            description: chapter.description,
            order: chapter.order,
            book: {
              connect: { id: book.id }
            }
          }
        });
        console.log(`Created chapter: ${chapter.title}`);
      } else {
        console.log(`Chapter already exists: ${chapter.title}`);
      }
      
      // Create sections for the chapter
      for (const section of chapter.sections) {
        let sectionRecord = await prisma.section.findFirst({
          where: { 
            title: section.title,
            chapterId: chapterRecord.id 
          }
        });
        
        if (!sectionRecord) {
          sectionRecord = await prisma.section.create({
            data: {
              title: section.title,
              description: section.description,
              order: section.order,
              chapter: {
                connect: { id: chapterRecord.id }
              }
            }
          });
          console.log(`Created section: ${section.title}`);
        } else {
          console.log(`Section already exists: ${section.title}`);
        }
        
        // Create content (paragraphs, figures, exercises) for the section
        for (const item of section.content) {
          if (item.type === 'paragraph') {
            await prisma.paragraph.create({
              data: {
                content: item.content,
                order: item.order,
                section: {
                  connect: { id: sectionRecord.id }
                }
              }
            });
            console.log(`Created paragraph in section ${section.title}`);
          } else if (item.type === 'figure') {
            await prisma.figure.create({
              data: {
                title: item.title,
                caption: item.caption,
                imageUrl: item.imageUrl,
                order: item.order,
                section: {
                  connect: { id: sectionRecord.id }
                }
              }
            });
            console.log(`Created figure in section ${section.title}`);
          } else if (item.type === 'exercise') {
            await prisma.exercise.create({
              data: {
                content: item.content,
                type: item.type || 'problem-solving',
                difficultyLevel: item.difficultyLevel,
                solution: item.solution,
                order: item.order,
                section: {
                  connect: { id: sectionRecord.id }
                }
              }
            });
            console.log(`Created exercise in section ${section.title}`);
          }
        }
      }
    }
  }

  // Generate student test data
  const generateStudents = async (count) => {
    const students = [];
    
    // List of realistic student names
    const studentNames = [
      "Sophia Garcia", "Ethan Williams", "Olivia Rodriguez", "Liam Johnson", 
      "Emma Martinez", "Noah Davis", "Ava Wilson", "Mason Brown", 
      "Isabella Taylor", "Jacob Thompson", "Mia Anderson", "Alexander Hernandez", 
      "Charlotte Lewis", "Benjamin Moore", "Amelia Jackson", "Lucas Martin",
      "Harper Harris", "William Lee", "Evelyn Clark", "James Walker"
    ];
    
    // Student performance data (for analytical dashboard)
    const performanceProfiles = [
      { knowledgeRetention: 92, collegeReadiness: 88, projectedSAT: 1410, projectedACT: 30 },
      { knowledgeRetention: 85, collegeReadiness: 82, projectedSAT: 1360, projectedACT: 28 },
      { knowledgeRetention: 78, collegeReadiness: 75, projectedSAT: 1280, projectedACT: 26 },
      { knowledgeRetention: 88, collegeReadiness: 84, projectedSAT: 1330, projectedACT: 27 },
      { knowledgeRetention: 75, collegeReadiness: 70, projectedSAT: 1220, projectedACT: 24 },
      { knowledgeRetention: 95, collegeReadiness: 92, projectedSAT: 1480, projectedACT: 32 },
      { knowledgeRetention: 82, collegeReadiness: 79, projectedSAT: 1300, projectedACT: 27 },
      { knowledgeRetention: 79, collegeReadiness: 77, projectedSAT: 1290, projectedACT: 26 },
      { knowledgeRetention: 72, collegeReadiness: 68, projectedSAT: 1190, projectedACT: 23 },
      { knowledgeRetention: 90, collegeReadiness: 87, projectedSAT: 1380, projectedACT: 29 }
    ];
    
    for (let i = 0; i < count && i < studentNames.length; i++) {
      const studentName = studentNames[i];
      const emailPrefix = studentName.toLowerCase().replace(' ', '.');
      const hashedPassword = await hashPassword('test123');
      const performanceData = performanceProfiles[i % performanceProfiles.length];

      try {
        let student = await prisma.user.findUnique({
          where: { email: `${emailPrefix}@school.org` },
        });

        if (!student) {
          student = await prisma.user.create({
            data: {
              email: `${emailPrefix}@school.org`,
              name: studentName,
              password: hashedPassword,
              role: 'STUDENT',
            },
          });
          console.log(`Created student: ${student.name}`);
        } else {
          console.log(`Student already exists: ${student.name}`);
        }
        
        // Add performance metrics as properties (not stored in DB, but used for display)
        student.knowledgeRetention = performanceData.knowledgeRetention;
        student.collegeReadiness = performanceData.collegeReadiness;
        student.projectedSAT = performanceData.projectedSAT;
        student.projectedACT = performanceData.projectedACT;
        
        students.push(student);
        
        // Assign students to 2-3 random classes
        const studentClasses = [];
        const numClasses = 2 + Math.floor(Math.random() * 2); // 2 or 3 classes
        const shuffledClasses = Object.values(classEntities).sort(() => 0.5 - Math.random());
        
        for (let j = 0; j < numClasses && j < shuffledClasses.length; j++) {
          studentClasses.push(shuffledClasses[j]);
        }
        
        // For easy reference later
        student.classes = studentClasses.map(cls => ({
          id: cls.classCode,
          name: cls.name
        }));
        
        // Enroll student in classes
        for (const classEntity of studentClasses) {
          // Check if enrollment already exists
          const existingEnrollment = await prisma.classEnrollment.findFirst({
            where: {
              userId: student.id,
              classId: classEntity.id
            }
          });

          if (!existingEnrollment) {
            await prisma.classEnrollment.create({
              data: {
                user: {
                  connect: { id: student.id }
                },
                class: {
                  connect: { id: classEntity.id }
                },
                status: 'ACTIVE'
              },
            });
            console.log(`Enrolled ${student.name} in ${classEntity.name}`);
          } else {
            console.log(`${student.name} already enrolled in ${classEntity.name}`);
          }
          
          // Create some notes for each student per class
          const course = await prisma.course.findUnique({
            where: { id: classEntity.courseId },
          });
          
          const noteCount = Math.floor(1 + Math.random() * 4);
          for (let k = 0; k < noteCount; k++) {
            const uniqueTimestamp = new Date().toISOString();
            try {
              await prisma.note.create({
                data: {
                  title: `${course.title} Note ${k + 1} - ${student.name} - ${uniqueTimestamp}`,
                  content: `This is a note for ${course.title} class (${classEntity.classCode}). Key concepts covered in today's class include...`,
                  userId: student.id,
                  tags: [course.title.toLowerCase(), classEntity.classCode, 'class notes'],
                  type: Math.random() > 0.5 ? 'permanent' : 'literature',
                  visibility: Math.random() > 0.3 ? 'public' : 'private',
                  processed: false,
                },
              });
              console.log(`Created note for ${student.name} in ${course.title}`);
            } catch (noteError) {
              console.error(`Error creating note for ${student.name}:`, noteError.message);
            }
          }

          // Create memory structures for some students
          if (i % 3 === 0) { // Every 3rd student gets a memory palace
            const palace = await prisma.palace.create({
              data: {
                name: `${student.name}'s ${course.title} Memory Palace`,
                description: `Memory palace for key concepts in ${course.title}`,
                userId: student.id
              }
            });

            // Create rooms in the palace
            const room = await prisma.room.create({
              data: {
                name: `${course.title} Concepts Room`,
                description: `Room for storing key ${course.title} concepts`,
                palaceId: palace.id
              }
            });

            // Create a note with mnemonic structure and related memory nodes
            const uniqueTimestamp = new Date().toISOString();
            try {
              const memoryNote = await prisma.note.create({
                data: {
                  title: `${course.title} Memory Structure - ${student.name} - ${uniqueTimestamp}`,
                  content: `Memory structure for key concepts in ${course.title}`,
                  userId: student.id,
                  tags: [course.title.toLowerCase(), classEntity.classCode, 'memory', 'mnemonic'],
                  mnemonicType: 'memoryPalace',
                  mnemonicData: { palaceId: palace.id },
                  processed: true,
                }
              });
              console.log(`Created memory structure for ${student.name} in ${course.title}`);
              
              // Create memory nodes
              const memoryNode = await prisma.memoryNode.create({
                data: {
                  noteId: memoryNote.id,
                  content: `Key concept from ${course.title}`,
                  description: `Visualization aid for remembering ${course.title} concept`,
                  position: 1
                }
              });
              console.log(`Created memory node for ${student.name}`);

              // Create palace node
              await prisma.palaceNode.create({
                data: {
                  memoryNodeId: memoryNode.id,
                  location: `Front of the ${course.title} Concepts Room`,
                  roomId: room.id
                }
              });
              console.log(`Created palace node for ${student.name}`);
              
            } catch (memoryError) {
              console.error(`Error creating memory structure for ${student.name}:`, memoryError.message);
              continue; // Skip the rest of this iteration if any part of memory structure creation fails
            }
          }
        }
      } catch (error) {
        console.error(`Error creating student ${studentName}:`, error);
      }
    }
    
    return students;
  };

  // Create students
  const students = await generateStudents(20);
  
  // Connect classes to teachers and staff
  // First, ensure all teachers are connected to their classes
  for (const teacherEmail in teacherUsers) {
    const teacher = teacherUsers[teacherEmail].user;
    
    // Find all classes taught by this teacher
    const teacherClasses = Object.values(classEntities).filter(cls => 
      classes.find(c => c.teacherEmail === teacherEmail && c.classCode === cls.classCode)
    );
    
    console.log(`Teacher ${teacher.name} has ${teacherClasses.length} classes`);
    
    // Ensure the teacher is enrolled in their own classes
    for (const classEntity of teacherClasses) {
      try {
        await prisma.classEnrollment.create({
          data: {
            userId: teacher.id,
            classId: classEntity.id,
            status: 'ACTIVE'
          }
        });
        console.log(`Enrolled teacher ${teacher.name} in their class ${classEntity.name}`);
      } catch (error) {
        // Skip if enrollment already exists
        console.log(`Teacher ${teacher.name} already enrolled in class ${classEntity.name}`);
      }
    }
  }
  
  // Give staff access to all classes
  const staffUser = await prisma.user.findUnique({ where: { email: 'staff@school.org' } });
  
  if (staffUser) {
    // Assign all existing classes to the staff user (as if they have permission to view them)
    for (const classEntity of Object.values(classEntities)) {
      try {
        await prisma.classEnrollment.create({
          data: {
            userId: staffUser.id,
            classId: classEntity.id,
            status: 'ACTIVE'
          }
        });
        console.log(`Assigned class ${classEntity.name} to staff user ${staffUser.name}`);
      } catch (error) {
        // Skip if enrollment already exists
        console.log(`Class ${classEntity.name} already assigned to staff user ${staffUser.name}`);
      }
    }
  }
  
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });