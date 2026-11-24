export const profile = {
  name: 'Mallikanti Pavan',
  firstName: 'Mallikanti',
  restName: 'Pavan',
  title: 'AI/ML Engineer',
  email: 'pavanmallikanti29@gmail.com',
  phone: '+91 9391653787',
  github: 'https://github.com/MallikantiPavan',
  linkedin: 'https://linkedin.com/in/mallikantipavan/',
  resume: '/Mallikanti_Pavan_Resume.pdf',
  summary:
    'AI/ML engineer with research experience in deep learning and computer vision, developing PyTorch models for medical imaging and UAV detection.',
}

export const skillGroups = [
  { title: 'Programming Languages', shortTitle: 'Languages', index: '01', skills: ['Python', 'C++', 'C', 'SQL', 'SQLite'] },
  { title: 'AI / Machine Learning', shortTitle: 'AI / ML', index: '02', skills: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'OpenCV', 'NumPy', 'Pandas', 'Hugging Face Transformers'] },
  { title: 'Generative AI', shortTitle: 'Generative AI', index: '03', skills: ['RAG', 'GenAI', 'Prompt Engineering', 'LangChain', 'Ollama', 'LM Studio'] },
  { title: 'Tools & Platforms', shortTitle: 'Tools', index: '04', skills: ['n8n', 'Git', 'Docker', 'LaTeX', 'Linux', 'Weights & Biases', 'Google Colab', 'VS Code'] },
  { title: 'Backend Development', shortTitle: 'Backend', index: '05', skills: ['FastAPI', 'Streamlit'] },
]

export const experience = [
  {
    company: 'Indian Institute of Technology Madras',
    role: 'Research Intern — Focal Cortical Dysplasia',
    period: 'May 2026 – July 2026',
    location: 'Chennai, India',
    points: [
      'Developed a Normative-Deviation Guided Asymmetry-Aware Graph Transformer for automated Focal Cortical Dysplasia detection from structural MRI.',
      'Modeled structural relationships between brain regions using graph neural networks and inter-regional asymmetry patterns.',
      'Designed a disease-prior attention bias mechanism that incorporates normative deviation signals into Transformer attention logits.',
    ],
  },
  {
    company: 'Indian Institute of Information Technology Tiruchirappalli',
    role: 'Research Intern — CA-YOLONet',
    period: 'Nov 2025 – Jan 2026',
    location: 'Tiruchirappalli, India',
    points: [
      'Developed CA-YOLONet, a YOLO-based UAV object detector for adverse weather conditions.',
      'Improved mAP@50:95 from 65.1 to 67.3 through architectural and anchor optimization.',
      'Conducted ablation studies to validate individual architectural changes and improvements over the baseline.',
      'Served as first author of the ICICV Conference paper.',
    ],
  },
]

export const projects = [
  {
    number: '01',
    title: 'ChestAI',
    subtitle: 'Multi-View Chest X-ray Classification',
    category: 'Medical AI',
    description: 'A working end-to-end medical imaging system for thoracic pathology classification, explainability, and clinical-style report export.',
    tech: ['PyTorch', 'DenseNet121', 'ECA', 'FastAPI', 'Grad-CAM'],
    features: ['5-pathology shared backbone', 'PCA/KNN missing-view imputation', 'CheXpert pseudo-labeling', 'PDF export and upload history'],
    githubUrl: 'https://github.com/MallikantiPavan/ChestAI',
  },
  {
    number: '02',
    title: 'Document Chat RAG Agent',
    subtitle: 'Research-focused document assistant',
    category: 'Knowledge AI',
    description: 'A retrieval-augmented assistant that grounds answers in research PDFs and compares source content with recent information.',
    tech: ['LangChain', 'ChromaDB', 'Gemini', 'Tavily'],
    features: ['Overlapping PDF chunking', 'Hugging Face embeddings', 'Context-grounded Gemini answers', 'Agentic web search'],
    githubUrl: 'https://github.com/MallikantiPavan/Docuchat_agent',
  },
  {
    number: '03',
    title: 'AI Interview Assistant',
    subtitle: 'Voice-based mock interview platform',
    category: 'Conversational AI',
    description: 'A conversational interview assistant for practicing Python, English, HTML, CSS, and Generative AI with automated feedback.',
    tech: ['LangChain', 'Gemini', 'Flask'],
    features: ['Voice-based responses', 'Topic-driven interviews', 'Automated scoring', 'Improvement suggestions'],
    githubUrl: 'https://github.com/MallikantiPavan/Interview_Assistent',
  },
  {
    number: '04',
    title: 'OCR & Multilingual Spell Checker',
    subtitle: 'Multilingual OCR and text correction',
    category: 'NLP',
    description: 'A multilingual OCR application that extracts text from images, checks spelling, generates documents, and reports text statistics.',
    tech: ['Python', 'NLP', 'OCR', 'Tesseract', 'FastAPI', 'REST APIs', 'Streamlit', 'Corpus Processing', 'DOCX Generation'],
    features: [
      'English and Telugu text extraction from images using Tesseract OCR and Python.',
      'Multilingual spell checking using Levenshtein, Jaro, LCS, and Hamming distance.',
      'FastAPI backend for image uploads, OCR, spell checking, document generation, and text statistics.',
      'Streamlit interface with downloadable DOCX reports.',
    ],
    githubUrl: 'https://github.com/MallikantiPavan/Telugu-ocr-and-spell-checker',
  },
]

export const education = [
  {
    institution: 'Indian Institute of Technology, Madras',
    degree: 'Exchange Student — Data Science & AI',
    period: 'July 2026 – June 2027',
    location: 'Chennai, India',
  },
  {
    institution: 'Indian Institute of Information Technology, Manipur',
    degree: 'B.Tech — Computer Science and Engineering (AI & Data Science)',
    period: 'July 2023 – June 2027',
    location: 'Imphal, India',
    detail: 'CGPA: 8.30',
  },
]
