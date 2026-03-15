import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', '..', 'data');
const dbPath = path.join(dataDir, 'db.json');

let data = {
  users: [],
  user_stats: [],
  lessons: [],
  progress: [],
  chat_messages: [],
};

function load() {
  if (fs.existsSync(dbPath)) {
    data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
}

function save() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

load();

// Currículo por etapas: 2 ejercicios por etapa (más contenido en cada nivel)
function so(stage, sub) { return stage * 10 + sub; }
const defaultLessons = [
  { stage: 1, stage_title: 'Familiarización con el idioma', level: 'Beginner', title: 'Saludos y expresiones básicas', sort_order: so(1,1), vocabulary: ['Hello', 'Hi', 'Good morning', 'Thank you', 'Thanks', 'Excuse me', 'Please', 'Goodbye', 'Bye'], vocabulary_es: ['Hola', 'Hola', 'Buenos días', 'Gracias', 'Gracias', 'Disculpe', 'Por favor', 'Adiós', 'Adiós'], phrases: ['Hello!', 'Good morning!', 'Thank you.', 'Excuse me.', 'Thank you very much.'], phrases_es: ['¡Hola!', '¡Buenos días!', 'Gracias.', 'Disculpe.', 'Muchas gracias.'] },
  { stage: 1, stage_title: 'Familiarización con el idioma', level: 'Beginner', title: 'Más expresiones cotidianas', sort_order: so(1,2), vocabulary: ['Good afternoon', 'Good evening', 'Good night', 'See you', 'Take care', 'No problem'], vocabulary_es: ['Buenas tardes', 'Buenas noches', 'Buenas noches', 'Hasta luego', 'Cuídate', 'No hay problema'], phrases: ['Good afternoon! How are you?', 'See you tomorrow.', 'Take care!', 'No problem.'], phrases_es: ['¡Buenas tardes! ¿Cómo estás?', 'Hasta mañana.', '¡Cuídate!', 'No hay problema.'] },
  { stage: 2, stage_title: 'Pronombres personales', level: 'Beginner', title: 'I, you, he, she, it, we, they', sort_order: so(2,1), vocabulary: ['I', 'You', 'He', 'She', 'It', 'We', 'They'], vocabulary_es: ['yo', 'tú / usted', 'él', 'ella', 'ello', 'nosotros', 'ellos / ellas'], phrases: ['I am here.', 'You are right.', 'He is my friend.', 'She is happy.', 'We are students.', 'They are friends.'], phrases_es: ['Yo estoy aquí.', 'Tienes razón.', 'Él es mi amigo.', 'Ella está feliz.', 'Somos estudiantes.', 'Ellos son amigos.'] },
  { stage: 2, stage_title: 'Pronombres personales', level: 'Beginner', title: 'Pronombres en oraciones', sort_order: so(2,2), vocabulary: ['my', 'your', 'his', 'her', 'our', 'their'], vocabulary_es: ['mi', 'tu', 'su (de él)', 'su (de ella)', 'nuestro', 'su (de ellos)'], phrases: ['This is my book.', 'That is your bag.', 'His name is Tom.', 'Her sister is a doctor.'], phrases_es: ['Este es mi libro.', 'Esa es tu bolsa.', 'Su nombre es Tom.', 'Su hermana es doctora.'] },
  { stage: 3, stage_title: 'Verbo to be', level: 'Beginner', title: 'Am, is, are – presentarse y describir', sort_order: so(3,1), vocabulary: ['am', 'is', 'are', 'a student', 'happy', 'friends', 'tired', 'here'], vocabulary_es: ['soy / estoy (I)', 'es / está', 'son / están', 'un estudiante', 'feliz', 'amigos', 'cansado', 'aquí'], phrases: ['I am a student.', 'She is happy.', 'They are friends.', 'I am tired.', 'She is here.'], phrases_es: ['Yo soy estudiante.', 'Ella está feliz.', 'Ellos son amigos.', 'Estoy cansado.', 'Ella está aquí.'] },
  { stage: 3, stage_title: 'Verbo to be', level: 'Beginner', title: 'To be en preguntas y respuestas', sort_order: so(3,2), vocabulary: ['Where is', 'Who is', 'How old', 'from', 'years old'], vocabulary_es: ['Dónde está', 'Quién es', 'Cuántos años', 'de', 'años'], phrases: ['Where are you from?', 'Who is she?', 'How old are you?', 'I am from Mexico.'], phrases_es: ['¿De dónde eres?', '¿Quién es ella?', '¿Cuántos años tienes?', 'Soy de México.'] },
  { stage: 4, stage_title: 'Oraciones afirmativas', level: 'Beginner', title: 'Sujeto + verbo + complemento', sort_order: so(4,1), vocabulary: ['tired', 'sister', 'brother', 'students', 'teacher', 'at home'], vocabulary_es: ['cansado', 'hermana', 'hermano', 'estudiantes', 'profesor', 'en casa'], phrases: ['I am tired.', 'She is my sister.', 'We are students.', 'He is a teacher.', 'They are at home.'], phrases_es: ['Estoy cansado.', 'Ella es mi hermana.', 'Somos estudiantes.', 'Él es profesor.', 'Están en casa.'] },
  { stage: 4, stage_title: 'Oraciones afirmativas', level: 'Beginner', title: 'Más oraciones con to be', sort_order: so(4,2), vocabulary: ['doctor', 'engineer', 'city', 'country', 'capital'], vocabulary_es: ['médico', 'ingeniero', 'ciudad', 'país', 'capital'], phrases: ['She is a doctor.', 'He is an engineer.', 'Madrid is the capital.', 'This is a big city.'], phrases_es: ['Ella es médica.', 'Él es ingeniero.', 'Madrid es la capital.', 'Esta es una ciudad grande.'] },
  { stage: 5, stage_title: 'Oraciones negativas', level: 'Beginner', title: 'Am not, is not, are not', sort_order: so(5,1), vocabulary: ['not', 'am not', "isn't", "aren't"], vocabulary_es: ['no', 'no soy / no estoy', 'no es / no está', 'no son / no están'], phrases: ['I am not tired.', 'She is not here.', 'They are not students.', "He isn't at home.", "We aren't late."], phrases_es: ['No estoy cansado.', 'Ella no está aquí.', 'No son estudiantes.', 'Él no está en casa.', 'No llegamos tarde.'] },
  { stage: 5, stage_title: 'Oraciones negativas', level: 'Beginner', title: 'Negar con to be – práctica', sort_order: so(5,2), vocabulary: ['wrong', 'right', 'sure', 'ready', 'interested'], vocabulary_es: ['equivocado', 'correcto', 'seguro', 'listo', 'interesado'], phrases: ['That is not right.', 'I am not sure.', 'We are not ready.', 'She is not interested.'], phrases_es: ['Eso no es correcto.', 'No estoy seguro.', 'No estamos listos.', 'Ella no está interesada.'] },
  { stage: 6, stage_title: 'Formación de preguntas', level: 'Beginner', title: 'Are you...? Is she...?', sort_order: so(6,1), vocabulary: ['Are you', 'Is she', 'Is he', 'Is it', 'Are we', 'Are they'], vocabulary_es: ['¿Eres tú? / ¿Estás?', '¿Es ella? / ¿Está?', '¿Es él? / ¿Está?', '¿Es? / ¿Está?', '¿Somos? / ¿Estamos?', '¿Son? / ¿Están?'], phrases: ['Are you happy?', 'Is she your friend?', 'Is he a teacher?', 'Are they at school?'], phrases_es: ['¿Estás feliz?', '¿Ella es tu amiga?', '¿Él es profesor?', '¿Están en la escuela?'] },
  { stage: 6, stage_title: 'Formación de preguntas', level: 'Beginner', title: 'Preguntas con What, Where, Why', sort_order: so(6,2), vocabulary: ['What is', 'Where is', 'Why is', 'When is', 'How is'], vocabulary_es: ['Qué es', 'Dónde está', 'Por qué está', 'Cuándo es', 'Cómo está'], phrases: ['What is your name?', 'Where is the bathroom?', 'Why are you late?', 'How are you?'], phrases_es: ['¿Cómo te llamas?', '¿Dónde está el baño?', '¿Por qué llegas tarde?', '¿Cómo estás?'] },
  { stage: 7, stage_title: 'Respuestas básicas', level: 'Beginner', title: 'Yes, I am. No, I am not.', sort_order: so(7,1), vocabulary: ['Yes', 'No', 'I am', 'I am not', 'she is', "she isn't", 'they are', "they aren't"], vocabulary_es: ['Sí', 'No', 'yo soy / estoy', 'yo no soy / no estoy', 'ella es / está', 'ella no es / no está', 'ellos son / están', 'ellos no son / no están'], phrases: ['Are you a student? Yes, I am.', 'Are you tired? No, I am not.', 'Is she here? Yes, she is.', 'Are they friends? No, they are not.'], phrases_es: ['¿Eres estudiante? Sí, lo soy.', '¿Estás cansado? No, no lo estoy.', '¿Ella está aquí? Sí, está.', '¿Son amigos? No, no lo son.'] },
  { stage: 7, stage_title: 'Respuestas básicas', level: 'Beginner', title: 'Respuestas cortas en diálogo', sort_order: so(7,2), vocabulary: ['Really', 'Sure', 'Of course', 'I see', 'Okay'], vocabulary_es: ['En serio', 'Claro', 'Por supuesto', 'Ya veo', 'Vale'], phrases: ['Do you like it? Yes, I do.', 'Can you help? Of course.', 'Is that true? Yes, really.'], phrases_es: ['¿Te gusta? Sí.', '¿Puedes ayudar? Por supuesto.', '¿Es verdad? Sí, en serio.'] },
  { stage: 8, stage_title: 'Expansión de vocabulario', level: 'Beginner', title: 'Personas, lugares, objetos y comida', sort_order: so(8,1), vocabulary: ['teacher', 'friend', 'school', 'house', 'phone', 'book', 'bread', 'rice', 'water', 'coffee'], vocabulary_es: ['profesor', 'amigo', 'escuela', 'casa', 'teléfono', 'libro', 'pan', 'arroz', 'agua', 'café'], phrases: ['She is a teacher.', 'I have a friend.', 'We are at school.', 'The book is on the table.', 'I want bread and water.'], phrases_es: ['Ella es profesora.', 'Tengo un amigo.', 'Estamos en la escuela.', 'El libro está en la mesa.', 'Quiero pan y agua.'] },
  { stage: 8, stage_title: 'Expansión de vocabulario', level: 'Beginner', title: 'Números, colores y días', sort_order: so(8,2), vocabulary: ['one', 'two', 'three', 'red', 'blue', 'Monday', 'Tuesday', 'today'], vocabulary_es: ['uno', 'dos', 'tres', 'rojo', 'azul', 'lunes', 'martes', 'hoy'], phrases: ['I have two books.', 'The car is red.', 'Today is Monday.', 'I work on Tuesday.'], phrases_es: ['Tengo dos libros.', 'El coche es rojo.', 'Hoy es lunes.', 'Trabajo los martes.'] },
  { stage: 9, stage_title: 'Verbos de acción', level: 'Elementary', title: 'Eat, work, study, go, live', sort_order: so(9,1), vocabulary: ['eat', 'work', 'study', 'go', 'live', 'sleep', 'read', 'write', 'speak'], vocabulary_es: ['comer', 'trabajar', 'estudiar', 'ir', 'vivir', 'dormir', 'leer', 'escribir', 'hablar'], phrases: ['I eat breakfast at eight.', 'She works every day.', 'We study English.', 'They go to school.', 'He lives in Madrid.'], phrases_es: ['Desayuno a las ocho.', 'Ella trabaja todos los días.', 'Estudiamos inglés.', 'Van a la escuela.', 'Él vive en Madrid.'] },
  { stage: 9, stage_title: 'Verbos de acción', level: 'Elementary', title: 'Más verbos: make, take, have', sort_order: so(9,2), vocabulary: ['make', 'take', 'have', 'get', 'know', 'want', 'need'], vocabulary_es: ['hacer', 'tomar / llevar', 'tener', 'obtener / llegar', 'saber / conocer', 'querer', 'necesitar'], phrases: ['I make coffee in the morning.', 'She takes the bus.', 'We have lunch at one.', 'They get up early.'], phrases_es: ['Hago café por la mañana.', 'Ella toma el autobús.', 'Comemos a la una.', 'Se levantan temprano.'] },
  { stage: 10, stage_title: 'Presente simple', level: 'Elementary', title: 'Rutinas y hábitos', sort_order: so(10,1), vocabulary: ['every day', 'in the morning', 'in the afternoon', 'at night', 'usually', 'often'], vocabulary_es: ['cada día', 'por la mañana', 'por la tarde', 'por la noche', 'usualmente', 'a menudo'], phrases: ['I work every day.', 'She studies English.', 'We eat lunch at one.', 'They go home at five.'], phrases_es: ['Trabajo todos los días.', 'Ella estudia inglés.', 'Comemos a la una.', 'Van a casa a las cinco.'] },
  { stage: 10, stage_title: 'Presente simple', level: 'Elementary', title: 'He/She/It – tercera persona', sort_order: so(10,2), vocabulary: ['he works', 'she goes', 'it needs', 'he has', 'she does'], vocabulary_es: ['él trabaja', 'ella va', 'ello necesita', 'él tiene', 'ella hace'], phrases: ['He works in an office.', 'She goes to the gym.', 'The shop opens at nine.', 'My brother lives in London.'], phrases_es: ['Él trabaja en una oficina.', 'Ella va al gimnasio.', 'La tienda abre a las nueve.', 'Mi hermano vive en Londres.'] },
  { stage: 11, stage_title: 'Conversaciones guiadas', level: 'Elementary', title: 'Diálogos básicos', sort_order: so(11,1), vocabulary: ['greet', 'answer', 'ask', 'reply', 'meet'], vocabulary_es: ['saludar', 'responder', 'preguntar', 'contestar', 'conocer'], phrases: ['Hello! How are you?', "I'm fine, thank you. And you?", "Nice to meet you.", "What's your name?", 'My name is Ana.'], phrases_es: ['¡Hola! ¿Cómo estás?', 'Estoy bien, gracias. ¿Y tú?', 'Encantado de conocerte.', '¿Cómo te llamas?', 'Me llamo Ana.'] },
  { stage: 11, stage_title: 'Conversaciones guiadas', level: 'Elementary', title: 'Pedir y dar información', sort_order: so(11,2), vocabulary: ['address', 'phone number', 'email', 'occupation', 'nationality'], vocabulary_es: ['dirección', 'teléfono', 'correo', 'ocupación', 'nacionalidad'], phrases: ['What is your phone number?', 'Where do you live?', 'What do you do?', 'I am a student.'], phrases_es: ['¿Cuál es tu número de teléfono?', '¿Dónde vives?', '¿A qué te dedicas?', 'Soy estudiante.'] },
  { stage: 12, stage_title: 'Pronunciación', level: 'Elementary', title: 'Sonidos, entonación y ritmo', sort_order: so(12,1), vocabulary: ['stress', 'intonation', 'rhythm', 'sound'], vocabulary_es: ['acento', 'entonación', 'ritmo', 'sonido'], phrases: ['Good morning!', 'How are you?', 'Thank you very much.', 'Excuse me, please.', 'I am a student.'], phrases_es: ['¡Buenos días!', '¿Cómo estás?', 'Muchas gracias.', 'Disculpe, por favor.', 'Soy estudiante.'] },
  { stage: 12, stage_title: 'Pronunciación', level: 'Elementary', title: 'Frases con entonación correcta', sort_order: so(12,2), vocabulary: ['question', 'answer', 'sentence', 'clear'], vocabulary_es: ['pregunta', 'respuesta', 'oración', 'claro'], phrases: ['Are you coming?', 'Yes, I am.', 'What time is it?', 'It is five o\'clock.'], phrases_es: ['¿Vienes?', 'Sí, voy.', '¿Qué hora es?', 'Son las cinco.'] },
  { stage: 13, stage_title: 'Conversación libre', level: 'Pre-Intermediate', title: 'Familia, trabajo, estudios y hobbies', sort_order: so(13,1), vocabulary: ['family', 'work', 'job', 'studies', 'hobby', 'hobbies', 'food', 'like', 'love'], vocabulary_es: ['familia', 'trabajo', 'empleo', 'estudios', 'pasatiempo', 'pasatiempos', 'comida', 'gustar', 'encantar'], phrases: ['I have a big family.', 'I work in an office.', 'I study English.', 'My hobby is reading.', 'I like coffee and bread.'], phrases_es: ['Tengo una familia grande.', 'Trabajo en una oficina.', 'Estudio inglés.', 'Mi pasatiempo es leer.', 'Me gusta el café y el pan.'] },
  { stage: 13, stage_title: 'Conversación libre', level: 'Pre-Intermediate', title: 'Describir gustos y preferencias', sort_order: so(13,2), vocabulary: ['prefer', 'favourite', 'enjoy', 'hate', 'mind'], vocabulary_es: ['preferir', 'favorito', 'disfrutar', 'odiar', 'importar'], phrases: ['I prefer tea to coffee.', 'My favourite colour is blue.', 'I enjoy reading.', 'I do not mind.'], phrases_es: ['Prefiero el té al café.', 'Mi color favorito es el azul.', 'Disfruto leyendo.', 'No me importa.'] },
  { stage: 14, stage_title: 'Pasado simple', level: 'Intermediate', title: 'Verbos regulares e irregulares en pasado', sort_order: so(14,1), vocabulary: ['went', 'ate', 'saw', 'had', 'did', 'yesterday', 'last week', 'ago'], vocabulary_es: ['fui', 'comí', 'vi', 'tuve', 'hice', 'ayer', 'la semana pasada', 'hace'], phrases: ['I went to school yesterday.', 'She had breakfast at seven.', 'They saw a movie last week.', 'We did our homework.'], phrases_es: ['Fui al colegio ayer.', 'Ella desayunó a las siete.', 'Vieron una película la semana pasada.', 'Hicimos la tarea.'] },
  { stage: 14, stage_title: 'Pasado simple', level: 'Intermediate', title: 'Pasado en preguntas y negativas', sort_order: so(14,2), vocabulary: ['Did you', 'Did she', "Didn't", 'When did', 'Why did'], vocabulary_es: ['¿Fuiste tú?', '¿Ella fue?', 'no (pasado)', 'Cuándo', 'Por qué'], phrases: ['Did you go to the party?', 'She did not see him.', 'When did they leave?', 'Why did you say that?'], phrases_es: ['¿Fuiste a la fiesta?', 'Ella no lo vio.', '¿Cuándo se fueron?', '¿Por qué dijiste eso?'] },
  { stage: 15, stage_title: 'Conversación diaria', level: 'Intermediate', title: 'Adverbios de frecuencia y rutinas', sort_order: so(15,1), vocabulary: ['usually', 'sometimes', 'often', 'always', 'never', 'hardly ever', 'every day'], vocabulary_es: ['usualmente', 'a veces', 'a menudo', 'siempre', 'nunca', 'casi nunca', 'cada día'], phrases: ['What do you usually do in the morning?', 'I sometimes go to the gym.', 'She always drinks coffee.', 'They never eat meat.'], phrases_es: ['¿Qué sueles hacer por la mañana?', 'A veces voy al gimnasio.', 'Ella siempre toma café.', 'Nunca comen carne.'] },
  { stage: 15, stage_title: 'Conversación diaria', level: 'Intermediate', title: 'Rutinas en pasado y presente', sort_order: so(15,2), vocabulary: ['used to', 'would', 'habit', 'routine', 'schedule'], vocabulary_es: ['solía', 'would (pasado habitual)', 'hábito', 'rutina', 'horario'], phrases: ['I used to play football.', 'We would meet every Friday.', 'She has a busy schedule.', 'What is your daily routine?'], phrases_es: ['Solía jugar al fútbol.', 'Nos reuníamos cada viernes.', 'Ella tiene un horario muy ocupado.', '¿Cuál es tu rutina diaria?'] },
  { stage: 16, stage_title: 'Futuro con will', level: 'Intermediate', title: 'Predicciones y promesas', sort_order: so(16,1), vocabulary: ['will', "won't", 'tomorrow', 'next week', 'maybe', 'probably'], vocabulary_es: ['will (futuro)', 'no haré / no será', 'mañana', 'la próxima semana', 'tal vez', 'probablemente'], phrases: ['I will call you tomorrow.', 'She will be late.', 'They will not come.', 'We will travel next year.'], phrases_es: ['Te llamaré mañana.', 'Ella llegará tarde.', 'No vendrán.', 'Viajaremos el próximo año.'] },
  { stage: 16, stage_title: 'Futuro con will', level: 'Intermediate', title: 'Going to y ofertas con will', sort_order: so(16,2), vocabulary: ['going to', 'plan', 'intention', 'offer', 'promise'], vocabulary_es: ['ir a (futuro)', 'plan', 'intención', 'oferta', 'promesa'], phrases: ['I am going to study tonight.', 'She is going to travel.', 'I will help you.', 'We will not forget.'], phrases_es: ['Voy a estudiar esta noche.', 'Ella va a viajar.', 'Te ayudaré.', 'No lo olvidaremos.'] },
  { stage: 17, stage_title: 'Condicionales tipo 1', level: 'Upper-Intermediate', title: 'If + presente, will + infinitivo', sort_order: so(17,1), vocabulary: ['if', 'unless', 'when', 'rain', 'will go', 'will be'], vocabulary_es: ['si', 'a menos que', 'cuando', 'lluvia', 'iré', 'será'], phrases: ['If it rains, I will stay at home.', 'If you study, you will pass.', 'Unless you hurry, you will be late.'], phrases_es: ['Si llueve, me quedaré en casa.', 'Si estudias, aprobarás.', 'A menos que te des prisa, llegarás tarde.'] },
  { stage: 17, stage_title: 'Condicionales tipo 1', level: 'Upper-Intermediate', title: 'Más condicionales reales', sort_order: so(17,2), vocabulary: ['as long as', 'provided that', 'in case', 'might', 'may'], vocabulary_es: ['siempre que', 'siempre que', 'por si acaso', 'podría', 'podría'], phrases: ['I will go as long as you come.', 'Provided that it is fine, we will go out.', 'Take an umbrella in case it rains.'], phrases_es: ['Iré siempre que vengas tú.', 'Siempre que haga buen tiempo, saldremos.', 'Lleva paraguas por si llueve.'] },
  { stage: 18, stage_title: 'Condicionales tipo 2', level: 'Upper-Intermediate', title: 'Situaciones hipotéticas (would)', sort_order: so(18,1), vocabulary: ['would', 'could', 'might', 'if I had', 'if I were'], vocabulary_es: ['would (condicional)', 'podría', 'podría', 'si yo tuviera', 'si yo fuera'], phrases: ['If I had time, I would learn more.', 'If I were rich, I would travel.', 'She would help if she could.'], phrases_es: ['Si tuviera tiempo, aprendería más.', 'Si fuera rico, viajaría.', 'Ella ayudaría si pudiera.'] },
  { stage: 18, stage_title: 'Condicionales tipo 2', level: 'Upper-Intermediate', title: 'Condicionales irreales – práctica', sort_order: so(18,2), vocabulary: ['wish', 'if only', 'imagine', 'suppose'], vocabulary_es: ['desear', 'ojalá', 'imaginar', 'suponer'], phrases: ['I wish I could fly.', 'If only I had known.', 'Imagine you won the lottery.', 'Suppose she said no.'], phrases_es: ['Ojalá pudiera volar.', 'Ojalá lo hubiera sabido.', 'Imagina que ganas la lotería.', 'Supón que ella dijo que no.'] },
  { stage: 19, stage_title: 'Presente perfecto', level: 'Upper-Intermediate', title: 'Have/has + pasado participio', sort_order: so(19,1), vocabulary: ['have been', 'has gone', 'already', 'yet', 'just', 'ever', 'never'], vocabulary_es: ['he estado', 'ha ido', 'ya', 'aún no', 'acabar de', 'alguna vez', 'nunca'], phrases: ['I have been to London.', 'She has just left.', 'Have you ever tried sushi?', 'They have not finished yet.'], phrases_es: ['He estado en Londres.', 'Ella acaba de irse.', '¿Has probado el sushi alguna vez?', 'Aún no han terminado.'] },
  { stage: 19, stage_title: 'Presente perfecto', level: 'Upper-Intermediate', title: 'Present perfect continuo y for/since', sort_order: so(19,2), vocabulary: ['have been doing', 'for', 'since', 'how long', 'recently'], vocabulary_es: ['he estado haciendo', 'desde hace', 'desde', 'cuánto tiempo', 'recientemente'], phrases: ['I have been working for two hours.', 'She has lived here since 2020.', 'How long have you known him?', 'I have recently started.'], phrases_es: ['Llevo dos horas trabajando.', 'Ella vive aquí desde 2020.', '¿Cuánto tiempo hace que lo conoces?', 'He empezado hace poco.'] },
  { stage: 20, stage_title: 'Vocabulario avanzado', level: 'Advanced', title: 'Expresiones y phrasal verbs', sort_order: so(20,1), vocabulary: ['look forward to', 'give up', 'find out', 'take care of', 'run out of'], vocabulary_es: ['tener ganas de', 'rendirse', 'averiguar', 'cuidar de', 'quedarse sin'], phrases: ['I look forward to seeing you.', 'Do not give up.', 'We found out the truth.', 'She takes care of her mother.'], phrases_es: ['Tengo ganas de verte.', 'No te rindas.', 'Averiguamos la verdad.', 'Ella cuida de su madre.'] },
  { stage: 20, stage_title: 'Vocabulario avanzado', level: 'Advanced', title: 'Más phrasal verbs', sort_order: so(20,2), vocabulary: ['carry on', 'deal with', 'turn down', 'bring up', 'look after'], vocabulary_es: ['seguir', 'lidiar con', 'rechazar', 'criar / sacar tema', 'cuidar'], phrases: ['Carry on with your work.', 'We need to deal with this.', 'He turned down the offer.', 'She was brought up in London.'], phrases_es: ['Sigue con tu trabajo.', 'Tenemos que lidiar con esto.', 'Rechazó la oferta.', 'Se crió en Londres.'] },
  { stage: 21, stage_title: 'Argumentación y opinión', level: 'Advanced', title: 'Expresar opinión y desacuerdo', sort_order: so(21,1), vocabulary: ['I think', 'In my opinion', 'I agree', 'I disagree', 'However', 'Therefore'], vocabulary_es: ['creo que', 'en mi opinión', 'estoy de acuerdo', 'no estoy de acuerdo', 'sin embargo', 'por lo tanto'], phrases: ['In my opinion, that is wrong.', 'I agree with you.', 'However, we need more time.', 'I think we should try again.'], phrases_es: ['En mi opinión, eso está mal.', 'Estoy de acuerdo contigo.', 'Sin embargo, necesitamos más tiempo.', 'Creo que deberíamos intentarlo de nuevo.'] },
  { stage: 21, stage_title: 'Argumentación y opinión', level: 'Advanced', title: 'Debatir y persuadir', sort_order: so(21,2), vocabulary: ['argue', 'persuade', 'convince', 'claim', 'evidence'], vocabulary_es: ['argumentar', 'persuadir', 'convencer', 'afirmar', 'evidencia'], phrases: ['I would argue that...', 'The evidence suggests...', 'It is clear that...', 'We must consider...'], phrases_es: ['Yo diría que...', 'La evidencia sugiere...', 'Está claro que...', 'Debemos considerar...'] },
  { stage: 22, stage_title: 'Conversación fluida', level: 'Advanced', title: 'Debates y temas complejos', sort_order: so(22,1), vocabulary: ['actually', 'basically', 'obviously', 'apparently', 'frankly', 'overall'], vocabulary_es: ['en realidad', 'básicamente', 'obviamente', 'al parecer', 'francamente', 'en general'], phrases: ['Actually, I meant something else.', 'Basically, we need to decide.', 'Frankly, I do not agree.', 'Overall, it was a good experience.'], phrases_es: ['En realidad, quise decir otra cosa.', 'Básicamente, tenemos que decidir.', 'Francamente, no estoy de acuerdo.', 'En general, fue una buena experiencia.'] },
  { stage: 22, stage_title: 'Conversación fluida', level: 'Advanced', title: 'Resumen y conclusiones en inglés', sort_order: so(22,2), vocabulary: ['in conclusion', 'to sum up', 'in summary', 'all in all', 'at the end'], vocabulary_es: ['en conclusión', 'para resumir', 'en resumen', 'en conjunto', 'al final'], phrases: ['In conclusion, we need to act.', 'To sum up, the project was successful.', 'All in all, it was worth it.'], phrases_es: ['En conclusión, hay que actuar.', 'Para resumir, el proyecto fue un éxito.', 'En conjunto, valió la pena.'] },
];

const VOCAB_SORT_START = 1000;
const vocabularyLessons = [
  { category: 'vocabulary', level: 'Vocabulary', title: 'Alphabet', sort_order: VOCAB_SORT_START + 1, vocabulary: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], vocabulary_es: ['ei', 'bi', 'si', 'di', 'i', 'ef', 'yi', 'eich', 'ai', 'yei', 'kei', 'el', 'em', 'en', 'ou', 'pi', 'kiu', 'ar', 'es', 'ti', 'iu', 'vi', 'dabliu', 'eks', 'uai', 'zi'], phrases: ['The alphabet has twenty-six letters.', 'A, B, C, D, E.', 'How do you spell your name?'], phrases_es: ['El alfabeto tiene veintiséis letras.', 'A, B, C, D, E.', '¿Cómo se escribe tu nombre?'] },
  { category: 'vocabulary', level: 'Vocabulary', title: 'Numbers', sort_order: VOCAB_SORT_START + 2, vocabulary: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'twenty', 'hundred'], vocabulary_es: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'veinte', 'cien'], phrases: ['I have two apples.', 'She is five years old.', 'There are ten students.', 'One hundred percent.'], phrases_es: ['Tengo dos manzanas.', 'Ella tiene cinco años.', 'Hay diez estudiantes.', 'Cien por ciento.'] },
  { category: 'vocabulary', level: 'Vocabulary', title: 'Fruits', sort_order: VOCAB_SORT_START + 3, vocabulary: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'watermelon', 'peach', 'pear', 'lemon', 'cherry'], vocabulary_es: ['manzana', 'plátano', 'naranja', 'uva', 'fresa', 'sandía', 'melocotón', 'pera', 'limón', 'cereza'], phrases: ['I like apples and bananas.', 'She bought oranges.', 'The watermelon is sweet.', 'Can I have some grapes?'], phrases_es: ['Me gustan las manzanas y los plátanos.', 'Ella compró naranjas.', 'La sandía es dulce.', '¿Me das uvas?'] },
  { category: 'vocabulary', level: 'Vocabulary', title: 'Vegetables', sort_order: VOCAB_SORT_START + 4, vocabulary: ['carrot', 'tomato', 'potato', 'onion', 'broccoli', 'lettuce', 'cucumber', 'pepper', 'corn', 'spinach'], vocabulary_es: ['zanahoria', 'tomate', 'patata', 'cebolla', 'brócoli', 'lechuga', 'pepino', 'pimiento', 'maíz', 'espinaca'], phrases: ['I need carrots and tomatoes.', 'She eats broccoli.', 'Add some onion.', 'The salad has lettuce and cucumber.'], phrases_es: ['Necesito zanahorias y tomates.', 'Ella come brócoli.', 'Añade un poco de cebolla.', 'La ensalada lleva lechuga y pepino.'] },
  { category: 'vocabulary', level: 'Vocabulary', title: 'Animals', sort_order: VOCAB_SORT_START + 5, vocabulary: ['dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig', 'rabbit', 'mouse', 'elephant'], vocabulary_es: ['perro', 'gato', 'pájaro', 'pez', 'caballo', 'vaca', 'cerdo', 'conejo', 'ratón', 'elefante'], phrases: ['I have a dog and a cat.', 'The bird can fly.', 'She likes horses.', 'Elephants are big.'], phrases_es: ['Tengo un perro y un gato.', 'El pájaro puede volar.', 'A ella le gustan los caballos.', 'Los elefantes son grandes.'] },
  { category: 'vocabulary', level: 'Vocabulary', title: 'Colors', sort_order: VOCAB_SORT_START + 6, vocabulary: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple', 'pink', 'brown'], vocabulary_es: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'naranja', 'morado', 'rosa', 'marrón'], phrases: ['The sky is blue.', 'She has a red dress.', 'I like green.', 'Black and white.'], phrases_es: ['El cielo es azul.', 'Ella tiene un vestido rojo.', 'Me gusta el verde.', 'Negro y blanco.'] },
  { category: 'vocabulary', level: 'Vocabulary', title: 'Food', sort_order: VOCAB_SORT_START + 7, vocabulary: ['bread', 'rice', 'meat', 'chicken', 'fish', 'egg', 'milk', 'cheese', 'water', 'coffee', 'breakfast', 'lunch', 'dinner'], vocabulary_es: ['pan', 'arroz', 'carne', 'pollo', 'pescado', 'huevo', 'leche', 'queso', 'agua', 'café', 'desayuno', 'almuerzo', 'cena'], phrases: ['I have bread and milk for breakfast.', 'We eat lunch at one.', 'She wants chicken and rice.', 'Can I have some water, please?'], phrases_es: ['Desayuno pan y leche.', 'Comemos a la una.', 'Ella quiere pollo y arroz.', '¿Me das agua, por favor?'] },
  { category: 'vocabulary', level: 'Vocabulary', title: 'Objects', sort_order: VOCAB_SORT_START + 8, vocabulary: ['book', 'pen', 'phone', 'table', 'chair', 'door', 'window', 'key', 'bag', 'lamp', 'clock', 'computer'], vocabulary_es: ['libro', 'bolígrafo', 'teléfono', 'mesa', 'silla', 'puerta', 'ventana', 'llave', 'bolso', 'lámpara', 'reloj', 'ordenador'], phrases: ['The book is on the table.', 'I need my phone.', 'Close the door, please.', 'She has a new computer.'], phrases_es: ['El libro está en la mesa.', 'Necesito mi teléfono.', 'Cierra la puerta, por favor.', 'Ella tiene un ordenador nuevo.'] },
  { category: 'vocabulary', level: 'Vocabulary', title: 'Family', sort_order: VOCAB_SORT_START + 9, vocabulary: ['mother', 'father', 'sister', 'brother', 'grandmother', 'grandfather', 'son', 'daughter', 'baby', 'family', 'parents', 'children'], vocabulary_es: ['madre', 'padre', 'hermana', 'hermano', 'abuela', 'abuelo', 'hijo', 'hija', 'bebé', 'familia', 'padres', 'hijos'], phrases: ['My mother is a teacher.', 'I have two brothers.', 'She lives with her family.', 'His parents are from Spain.'], phrases_es: ['Mi madre es profesora.', 'Tengo dos hermanos.', 'Ella vive con su familia.', 'Sus padres son de España.'] },
];

function lessonToRow(l, i) {
  return {
    id: i + 1,
    category: l.category || 'stage',
    stage: l.stage,
    stage_title: l.stage_title,
    level: l.level || 'Vocabulary',
    title: l.title,
    sort_order: l.sort_order,
    vocabulary: JSON.stringify(l.vocabulary),
    phrases: JSON.stringify(l.phrases),
    vocabulary_es: JSON.stringify(l.vocabulary_es || []),
    phrases_es: JSON.stringify(l.phrases_es || []),
    created_at: new Date().toISOString(),
  };
}

if (data.lessons.length === 0) {
  data.lessons = defaultLessons.map((l, i) => lessonToRow(l, i));
  let vid = data.lessons.length + 1;
  vocabularyLessons.forEach((def) => {
    const row = lessonToRow(def, vid - 1);
    row.id = vid;
    row.sort_order = def.sort_order;
    data.lessons.push(row);
    vid++;
  });
  data.lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  save();
} else {
  const hasStages = data.lessons.some((l) => l.stage != null);
  if (!hasStages) {
    data.lessons = defaultLessons.map((l, i) => lessonToRow(l, i));
    save();
  } else {
    const existingByKey = new Set(data.lessons.map((l) => `${l.stage}-${l.title}`));
    const maxId = data.lessons.length ? Math.max(...data.lessons.map((l) => l.id)) : 0;
    let nextIdLesson = maxId + 1;
    let changed = false;
    data.lessons.forEach((l) => {
      if (l.stage != null && (l.sort_order == null || l.sort_order < 100)) {
        l.sort_order = l.stage * 10 + 1;
        changed = true;
      }
    });
    defaultLessons.forEach((def) => {
      const key = `${def.stage}-${def.title}`;
      if (!existingByKey.has(key)) {
        const row = lessonToRow(def, nextIdLesson - 1);
        row.id = nextIdLesson;
        row.sort_order = def.sort_order;
        data.lessons.push(row);
        existingByKey.add(key);
        nextIdLesson++;
        changed = true;
      }
    });
    if (changed) {
      data.lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      save();
    } else {
      const defaultByKey = defaultLessons.reduce((acc, l) => { acc[`${l.stage}-${l.title}`] = l; return acc; }, {});
      let updated = false;
      data.lessons.forEach((l) => {
        const def = defaultByKey[`${l.stage}-${l.title}`];
        if (def && (!l.vocabulary_es || !l.phrases_es)) {
          l.vocabulary_es = JSON.stringify(def.vocabulary_es || []);
          l.phrases_es = JSON.stringify(def.phrases_es || []);
          updated = true;
        }
      });
      if (updated) save();
    }
  }
  const hasVocabulary = data.lessons.some((l) => l.category === 'vocabulary');
  if (!hasVocabulary) {
    const maxId = data.lessons.length ? Math.max(...data.lessons.map((l) => l.id)) : 0;
    let nextIdLesson = maxId + 1;
    vocabularyLessons.forEach((def, idx) => {
      const row = lessonToRow(def, nextIdLesson - 1);
      row.id = nextIdLesson;
      row.sort_order = def.sort_order;
      data.lessons.push(row);
      nextIdLesson++;
    });
    data.lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    save();
  }
}

function nextId(table) {
  const arr = data[table];
  if (!arr.length) return 1;
  return Math.max(...arr.map((r) => r.id)) + 1;
}

export const store = {
  users: {
    getById(id) {
      return data.users.find((u) => u.id === id);
    },
    getByEmail(email) {
      return data.users.find((u) => u.email === email.toLowerCase().trim());
    },
    insert(user) {
      const id = nextId('users');
      const row = { id, ...user, created_at: new Date().toISOString() };
      data.users.push(row);
      save();
      return { lastInsertRowid: id };
    },
  },
  user_stats: {
    get(userId) {
      return data.user_stats.find((s) => s.user_id === userId);
    },
    insert(row) {
      data.user_stats.push({ ...row, badges: row.badges || '[]' });
      save();
    },
    update(userId, updates) {
      const i = data.user_stats.findIndex((s) => s.user_id === userId);
      if (i >= 0) Object.assign(data.user_stats[i], updates);
      else data.user_stats.push({ user_id: userId, ...updates, badges: '[]' });
      save();
    },
  },
  lessons: {
    all(level, category) {
      let list = [...data.lessons].sort((a, b) => (a.sort_order || a.stage || 0) - (b.sort_order || b.stage || 0));
      if (category) list = list.filter((l) => (l.category || 'stage') === category);
      if (level) list = list.filter((l) => l.level === level);
      return list.map(({ vocabulary, phrases, vocabulary_es, phrases_es, ...r }) => ({
        ...r,
        vocabulary: vocabulary || '[]',
        phrases: phrases || '[]',
      }));
    },
    get(id) {
      const l = data.lessons.find((l) => l.id === Number(id));
      if (!l) return null;
      return {
        ...l,
        vocabulary: l.vocabulary || '[]',
        phrases: l.phrases || '[]',
        vocabulary_es: l.vocabulary_es || '[]',
        phrases_es: l.phrases_es || '[]',
      };
    },
  },
  progress: {
    get(userId, lessonId) {
      return data.progress.find((p) => p.user_id === userId && p.lesson_id === Number(lessonId));
    },
    upsert(row) {
      const i = data.progress.findIndex((p) => p.user_id === row.user_id && p.lesson_id === row.lesson_id);
      const r = { ...row, updated_at: new Date().toISOString() };
      if (i >= 0) data.progress[i] = { ...data.progress[i], ...r };
      else {
        r.id = nextId('progress');
        data.progress.push(r);
      }
      save();
      return r;
    },
    byUser(userId) {
      return data.progress.filter((p) => p.user_id === userId);
    },
  },
  chat_messages: {
    byUser(userId) {
      return data.chat_messages.filter((m) => m.user_id === userId);
    },
    insert(row) {
      const id = nextId('chat_messages');
      data.chat_messages.push({ id, ...row, created_at: new Date().toISOString() });
      save();
    },
  },
};

export default store;
