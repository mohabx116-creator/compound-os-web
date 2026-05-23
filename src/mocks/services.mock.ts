export interface VisitorPass {
  id: string;
  name: string;
  nationalId?: string;
  visitDate: string;
  visitTime: string;
  visitorType: 'FAMILY' | 'FRIEND' | 'DELIVERY' | 'WORKER';
  carPlate?: string;
  qrCode: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  capacity: number;
  imageUrl: string;
  bookingPrice: number;
  availableHours: string;
  rules: string[];
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  bookingDate: string;
  bookingTime: string;
  durationHours: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  qrCode: string;
}

export interface MaintenanceRequest {
  id: string;
  category: string;
  subCategory: string;
  description: string;
  preferredDate: string;
  preferredTimeSlot: string;
  status: 'PENDING' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTechnician?: {
    name: string;
    phone: string;
    avatar?: string;
  };
  notes?: string;
}

export interface DocumentFile {
  id: string;
  title: string;
  description: string;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'xlsx';
  downloadUrl: string;
  uploadedAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  replies: {
    sender: 'RESIDENT' | 'SUPPORT';
    senderName: string;
    message: string;
    createdAt: string;
  }[];
}

export interface ContactItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  workingHours?: string;
  category: 'SECURITY' | 'MAINTENANCE' | 'MANAGEMENT' | 'EMERGENCY';
}

export interface ChatRoom {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatarUrl?: string;
  senderRole: 'SECURITY' | 'MANAGEMENT' | 'ACCOUNTANT' | 'MAINTENANCE';
  messages: {
    id: string;
    sender: 'RESIDENT' | 'STAFF';
    text: string;
    timestamp: string;
  }[];
}

// ----------------------------------------------------
// MOCK DATA IMPLEMENTATIONS
// ----------------------------------------------------

export const mockVisitorPasses: VisitorPass[] = [
  {
    id: 'vis-501',
    name: 'خالد أحمد محمود',
    nationalId: '29201010101234',
    visitDate: '2026-05-24',
    visitTime: '18:00',
    visitorType: 'FRIEND',
    carPlate: 'أ ب ج 1 2 3',
    qrCode: 'COMP_OS_QR_501',
    status: 'ACTIVE',
  },
  {
    id: 'vis-502',
    name: 'مندوب توصيل أمازون',
    visitDate: '2026-05-23',
    visitTime: '14:30',
    visitorType: 'DELIVERY',
    qrCode: 'COMP_OS_QR_502',
    status: 'EXPIRED',
  },
  {
    id: 'vis-503',
    name: 'محمود السيد (فني تكييف)',
    visitDate: '2026-05-20',
    visitTime: '11:00',
    visitorType: 'WORKER',
    carPlate: 'ق ر و 9 8 7',
    qrCode: 'COMP_OS_QR_503',
    status: 'EXPIRED',
  },
];

export const mockFacilities: Facility[] = [
  {
    id: 'fac-601',
    name: 'ملعب التنس الرئيسي',
    description: 'ملعب تنس ترابي مجهز بالكامل بأحدث أنظمة الإضاءة الليلية لمتعة اللعب في أي وقت.',
    capacity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=400',
    bookingPrice: 100, // 100 EGP per hour
    availableHours: '٠٨:٠٠ ص - ١١:٠٠ م',
    rules: [
      'الالتزام بالملابس الرياضية والأحذية المخصصة للملاعب الرملية.',
      'الحد الأقصى لعدد اللاعبين داخل الملعب هو ٤ لاعبين.',
      'يرجى إلغاء الحجز قبل الموعد بـ ٣ ساعات على الأقل لاسترداد الرسوم.',
    ],
  },
  {
    id: 'fac-602',
    name: 'ملعب البادل الجديد',
    description: 'استمتع بلعب البادل في ملعبنا الزجاجي المغطى والجديد، متاح للحجز الفردي والجماعي.',
    capacity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400',
    bookingPrice: 150,
    availableHours: '٠٧:٠٠ ص - ١٢:٠٠ منتصف الليل',
    rules: [
      'يمنع إدخال المأكولات والمشروبات الغازية داخل أرض الملعب.',
      'يرجى الالتزام بالمواعيد المحددة وعدم تمديد وقت اللعب بدون حجز مسبق.',
    ],
  },
  {
    id: 'fac-603',
    name: 'قاعة المناسبات الكبرى',
    description: 'قاعة مجهزة بالكامل ومكيفة مناسبة لإقامة الحفلات العائلية وأعياد الميلاد وتتسع لـ ٨٠ شخصاً.',
    capacity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400',
    bookingPrice: 1000,
    availableHours: '٠٢:٠٠ م - ١١:٠٠ م',
    rules: [
      'يتطلب الحجز موافقة مسبقة من إدارة الكمباوند قبل موعد الفعالية بـ ٤٨ ساعة.',
      'الالتزام بالقوانين العامة وتجنب الإزعاج والضوضاء المرتفعة بعد الساعة ١٠ مساءً.',
      'يتحمل الساحب مسؤولية أي تلفيات تحدث في تجهيزات القاعة.',
    ],
  },
];

export const mockFacilityBookings: FacilityBooking[] = [
  {
    id: 'bk-701',
    facilityId: 'fac-602',
    facilityName: 'ملعب البادل الجديد',
    bookingDate: '2026-05-25',
    bookingTime: '19:00',
    durationHours: 2,
    totalPrice: 300,
    status: 'CONFIRMED',
    qrCode: 'COMP_OS_BOOK_701',
  },
  {
    id: 'bk-702',
    facilityId: 'fac-601',
    facilityName: 'ملعب التنس الرئيسي',
    bookingDate: '2026-05-18',
    bookingTime: '09:00',
    durationHours: 1,
    totalPrice: 100,
    status: 'COMPLETED',
    qrCode: 'COMP_OS_BOOK_702',
  },
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'maint-801',
    category: 'الكهرباء',
    subCategory: 'إصلاح لوحة التوزيع',
    description: 'توجد مشكلة تذبذب في التيار الكهربائي المنزلي ببعض غرف الطابق العلوي مما يسبب انقطاعاً مستمراً في المكيفات.',
    preferredDate: '2026-05-25',
    preferredTimeSlot: '٠٤:٠٠ م - ٠٦:٠٠ م',
    status: 'SCHEDULED',
    assignedTechnician: {
      name: 'م. شريف عبد العزيز',
      phone: '01234567890',
    },
    notes: 'تم تحديد موعد الزيارة والتأكيد مع العميل للتوجه للموقع.',
  },
  {
    id: 'maint-802',
    category: 'التكييف والتهوية',
    subCategory: 'غسيل وشحن فريون مكيف',
    description: 'مكيف غرفة المعيشة الرئيسي لا يبرد بشكل كاف، يصدر صوتاً مرتفعاً، يرجى غسل الفلاتر وفحص مستويات غاز الفريون.',
    preferredDate: '2026-05-21',
    preferredTimeSlot: '١٠:٠٠ ص - ١٢:٠٠ م',
    status: 'COMPLETED',
    assignedTechnician: {
      name: 'كابتن رامي السبكي',
      phone: '01122334455',
    },
    notes: 'تمت تعبئة الفريون وتنظيف مجاري المياه بنجاح والمكيف يعمل بكفاءة.',
  },
];

export const mockDocuments: DocumentFile[] = [
  {
    id: 'doc-901',
    title: 'اللائحة التنظيمية الداخلية للكمباوند',
    description: 'الدليل الكامل لقوانين ونظم المجمع السكني، وتشمل السلوك العام، تشجير الفلل، وقواعد الأمن والسلامة.',
    fileSize: '٢.٤ ميجابايت',
    fileType: 'pdf',
    downloadUrl: '#',
    uploadedAt: '2026-01-15',
  },
  {
    id: 'doc-902',
    title: 'استمارة تفويض بناء أو تعديل ديكور',
    description: 'النموذج الرسمي المعتمد لتقديم طلب إجراء تعديلات هندسية أو تجميلية على واجهات ومباني الوحدات السكنية.',
    fileSize: '٤٥٠ كيلوبايت',
    fileType: 'docx',
    downloadUrl: '#',
    uploadedAt: '2026-03-10',
  },
  {
    id: 'doc-903',
    title: 'جدول مواعيد الحافلات وخطوط السير',
    description: 'جدول محدث لمواعيد حافلات التوصيل اليومية المجانية الخاصة بنقل السكان من وإلى محطة المترو والمنطقة التجارية.',
    fileSize: '١.١ ميجابايت',
    fileType: 'xlsx',
    downloadUrl: '#',
    uploadedAt: '2026-05-01',
  },
];

export const mockCommunityRules: string[] = [
  'الالتزام بالهدوء التام والحد من الإزعاج الصوتي بجميع أشكاله بعد الساعة ١٠ مساءً.',
  'الحد الأقصى للسرعة المسموح بها للمركبات داخل الطرق الداخلية للكمباوند هي ٢٠ كم/ساعة حرصاً على سلامة المشاة والأطفال.',
  'يمنع وضع أكياس النفايات المنزلية خارج صناديق القمامة المخصصة أو تركها أمام الفلل في غير الأوقات المحددة لجمعها (من ٠٨:٠٠ ص وحتى ١١:٠٠ ص).',
  'يتوجب الحصول على موافقة خطية مسبقة من الإدارة الهندسية قبل البدء في أي أعمال حفر، بناء، صيانة خارجية، أو تغيير لألوان الواجهات.',
  'يجب مرافقة الأطفال دون سن ١٠ سنوات دائماً أثناء تواجدهم بالمناطق الترفيهية وحمامات السباحة العامة لسلامتهم.',
  'الالتزام التام بجمع مخلفات الحيوانات الأليفة فوراً أثناء التجول بها في الحدائق العامة والممرات واستخدام الأكياس المخصصة.',
];

export const mockFAQ: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'الخدمات العامة',
    question: 'كيف يمكنني حجز ملاعب البادل أو التنس؟',
    answer: 'يمكنك الانتقال إلى تبويب "الخدمات" من الشريط السفلي، ثم اختيار "حجز المرافق السكنية"، وتحديد نوع الملعب واليوم والساعة المفضلة، وسداد الرسوم إن وجدت ليتم تأكيد حجزك فوراً.',
  },
  {
    id: 'faq-2',
    category: 'الأمن والزوار',
    question: 'ما هي طريقة إصدار تصريح دخول للزوار أو سيارات الأجرة؟',
    answer: 'من خلال الصفحة الرئيسية أو قائمة الخدمات، اختر "إصدار تصريح دخول زائر"، املأ بيانات الزائر وتاريخ ووقت الزيارة، وسيقوم التطبيق بتوليد كود QR يمكنك مشاركته مع الزائر لعرضه عند بوابة الدخول الأمنية.',
  },
  {
    id: 'faq-3',
    category: 'المدفوعات والمستحقات',
    question: 'ما هي عواقب التأخر في سداد فواتير الصيانة الدورية؟',
    answer: 'في حال عدم السداد قبل الموعد المحدد (٥ من كل شهر)، سيتم إرسال تذكير إلكتروني أول وثانٍ. وإذا تجاوز التأخير ٣٠ يوماً، قد يتم تعليق خدمات الدخول الذكي وتطبيق رسوم تأخير وغرامات إدارية.',
  },
  {
    id: 'faq-4',
    category: 'الصيانة',
    question: 'هل خدمات صيانة الأعطال المنزلية مجانية؟',
    answer: 'الأعطال والصيانة في الأجزاء والمرافق المشتركة للكمباوند مجانية بالكامل ومشمولة برسوم الصيانة السنوية. أما خدمات الصيانة الخاصة بالفلل والشقق من الداخل (مثل سباكة الحمامات الخاصة أو التكييف المنزلي) فهي تخضع لرسوم تقديرية تحدد بعد معاينة الفني للخلل.',
  },
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'tkt-1001',
    title: 'مشكلة في سرعة الإنترنت المنزلي بالفايبر',
    category: 'الشبكات والاتصالات',
    status: 'IN_PROGRESS',
    createdAt: '2026-05-22T09:00:00Z',
    updatedAt: '2026-05-23T11:00:00Z',
    description: 'سرعة باقة الفايبر المنزلية انخفضت لـ ٥ ميجابت بالرغم من أن اشتراكي يدعم ١٠٠ ميجابت، يرجى فحص الكابينة الرئيسية بالشارع.',
    replies: [
      {
        sender: 'RESIDENT',
        senderName: 'أحمد محمود سليمان',
        message: 'سرعة الإنترنت بطيئة جداً منذ أمس، ولا أستطيع العمل عن بعد بشكل مريح. أرجو المعاينة السريعة.',
        createdAt: '2026-05-22T09:00:00Z',
      },
      {
        sender: 'SUPPORT',
        senderName: 'فريق الدعم الفني للبنية التحتية',
        message: 'نشكرك على إبلاغنا وتأسف للإزعاج. تم عمل فحص أولي للمشتركين بالقطاع ويظهر وجود عطل فني عام بأحد المقسمات، ومهندسينا يعملون على تبديله الآن. سيتم إبلاغك فور عودة الخدمة كاملة.',
        createdAt: '2026-05-23T11:00:00Z',
      },
    ],
  },
];

export const mockContacts: ContactItem[] = [
  {
    id: 'cont-1',
    name: 'بوابة الدخول الرئيسية والأمن',
    role: 'غرفة تحكم الأمن والعمليات',
    phone: '01011112222',
    workingHours: '٢٤ ساعة / طوال أيام الأسبوع',
    category: 'SECURITY',
  },
  {
    id: 'cont-2',
    name: 'مكتب مشرف صيانة القطاع',
    role: 'الصيانة الطارئة للأجزاء المشتركة',
    phone: '01122223333',
    workingHours: '٠٨:٠٠ ص - ١٠:٠٠ م',
    category: 'MAINTENANCE',
  },
  {
    id: 'cont-3',
    name: 'مكتب خدمة شؤون الملاك والسكان',
    role: 'عقود الملاك والاشتراكات والشكاوى الإدارية',
    phone: '01233334444',
    workingHours: '٠٩:٠٠ ص - ٠٥:٠٠ م (الجمعة والسبت عطلة)',
    category: 'MANAGEMENT',
  },
  {
    id: 'cont-4',
    name: 'رقم الإسعاف والطوارئ الطبية',
    role: 'طوارئ طبية وحوادث',
    phone: '123',
    category: 'EMERGENCY',
  },
];

export const mockChatRooms: ChatRoom[] = [
  {
    id: 'chat-sec',
    title: 'أمن البوابة والعمليات',
    lastMessage: 'التصريح فعال وسيارات خالد جاهزة للدخول.',
    lastMessageTime: '٠٢:٤٥ م',
    unreadCount: 1,
    senderRole: 'SECURITY',
    messages: [
      { id: 'm1', sender: 'RESIDENT', text: 'مرحباً، أرسلت تصريح زائر لصديقي خالد. هل البوابات على علم؟', timestamp: '٠٢:٣٠ م' },
      { id: 'm2', sender: 'STAFF', text: 'أهلاً بك يا فندم. نعم، يظهر تصريح خالد أحمد على نظام البوابة رقم ١. التصريح فعال وسيارات خالد جاهزة للدخول.', timestamp: '٠٢:٤٥ م' },
    ],
  },
  {
    id: 'chat-maint',
    title: 'مكتب الصيانة - م. شريف',
    lastMessage: 'سأقوم بالزيارة في الموعد المحدد غداً.',
    lastMessageTime: 'أمس',
    unreadCount: 0,
    senderRole: 'MAINTENANCE',
    messages: [
      { id: 'm3', sender: 'RESIDENT', text: 'هل يمكن تقديم موعد صيانة لوحة الكهرباء؟', timestamp: 'أول أمس' },
      { id: 'm4', sender: 'STAFF', text: 'أهلاً بك. جدول الزيارات ممتلئ تماماً اليوم للأسف. سأقوم بالزيارة في الموعد المحدد غداً.', timestamp: 'أمس' },
    ],
  },
];
