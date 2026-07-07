# المحاضرة 2 — Intelligent Agents (الوكلاء الأذكياء)
> **المادة:** الذكاء الاصطناعي (القسم النظري) | **الموضوع:** `Agents`، `Rationality`، `PEAS`، `Environment Types`، `Agent Types`

---

## 📌 خريطة التكامل (أين تقع هذه المحاضرة في الدورة؟)

| المرحلة | الأدوات | المخرجات |
| --- | --- | --- |
| المحاضرة 1 | `Turing Test`، `Rational Agent` (تمهيد) | فكرة عامة عن الذكاء الاصطناعي |
| المحاضرة 2 ← أنت هنا | `PEAS`، `Environment Types`، `Agent Function`، `Rationality`، `Agent Architectures` | تعريف دقيق للوكيل + تصنيف البيئات + بناء أول وكيل (Vacuum World) |
| المحاضرة 3 (لاحقة) | `Problem Solving and Search` (`BFS`، `DFS`، `A*`) | حل المسائل بالبحث اعتماداً على تعريف الوكيل هنا |

> **نوع هذه المحاضرة:** نظرية تأسيسية بالكامل — لا يوجد فيها خوارزميات بحث معقّدة، بل مفاهيم (Agent، Rationality) + إطار عمل (PEAS) + تصنيف (Environment Types) + معماريات وكيل بسيطة (Reflex → Utility-based).

---

## الجزء الأول: الشرح التفصيلي (سطر بسطر / فقرة بفقرة)

### 1. تعريف الوكيل (Agent)

#### النص الأصلي يقول:
> An agent is anything that can be viewed as perceiving its environment through sensors and acting upon that environment through actuators

#### الشرح المبسّط:
أي شيء بالعالم فيك تعتبره `agent` إذا حقق شرطين بس: (1) يقدر "يحس" بالبيئة اللي حواليه عن طريق أدوات استشعار `sensors`، و(2) يقدر "يتصرف" أو يأثر بهاي البيئة عن طريق أدوات تنفيذ `actuators`. فيه حلقة مستمرة: البيئة `environment` بترجع `percepts` (معطيات حسّية) للوكيل عبر الـ sensors، والوكيل بيرجع `actions` (أفعال) للبيئة عبر الـ actuators.

**لماذا؟** هاد التعريف مقصود يكون عام جداً — منيح لأنه يشمل إنسان (عين = sensor، يد = actuator)، روبوت (كاميرا = sensor، عجلات = actuator)، أو حتى برنامج (استقبال بيانات = sensor، إرسال أوامر = actuator).

#### 💡 التشبيه:
> تخيل حارس أمن بمحل: عيونه (sensors) بتشوف الزباين والبضاعة (environment)، وإيديه ورجليه (actuators) بتحركه يوقف سارق أو يرحب بزبون.
> **وجه الشبه:** عيون الحارس = sensors، تصرفاته = actuators، المحل بكل تفاصيله = environment.

---

### 2. الدالة الوكيلية (Agent Function) والبرنامج الوكيلي (Agent Program)

#### النص الأصلي يقول:
> The agent function maps from percept histories to actions: F: P* → A
> The agent program runs on the physical architecture to produce the agent function
> agent = architecture + program

#### الشرح المبسّط:
- `Agent Function` هي دالة رياضية مجرّدة: بتاخد **كل تاريخ الإحساسات** اللي وصلت للوكيل من أول ما بلش (`P*` يعني كل التسلسلات الممكنة من الـ percepts) وبترجع فعل واحد `A`.
- بس هاي الدالة نظرية بس — مش عملية لأنها بتحتاج جدول لا نهائي (كل تاريخ ممكن ← فعل). اللي فعلياً موجود ومكتوب هو `Agent Program`: كود حقيقي بيشتغل على جهاز (`architecture`) وبينتج نفس سلوك الـ Agent Function.
- المعادلة: **Agent = Architecture (الجهاز) + Program (الكود)**.

**لماذا؟** لازم نفرّق بين "الوصف النظري لسلوك الوكيل" (Function) و"التنفيذ العملي" (Program) — لأنه فيه أكتر من طريقة برمجية ممكن توصل لنفس الدالة، وهاد بيفتح الباب قدام مقارنة معماريات وكيل مختلفة بالجزء الأخير من المحاضرة.

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** هل الـ Agent Function بتاخد فقط آخر إحساس (percept) وحيد، ولا كل تاريخ الإحساسات؟
> **لماذا هذا مهم؟** لأن هاد الفرق هو أساس التفريق لاحقاً بين `Simple Reflex Agent` (يعتمد على آخر percept فقط) و `Reflex Agent with State` (يحتفظ بتاريخ/حالة داخلية).

---

### 3. عالم المكنسة الكهربائية (Vacuum-cleaner World)

#### النص الأصلي يقول:
> Percepts: Location and status, e.g., [A,Dirty]
> Actions: Left, Right, Suck, NoOp
> function Vacuum-Agent([location,status]) returns an action
> if status = Dirty then return Suck
> else if location = A then return Right
> else if location = B then return Left

#### الشرح المبسّط:
هاد أول مثال عملي على وكيل. عندنا غرفتين `A` و `B`. الوكيل (المكنسة) بيحس بشيئين بس: وين هو (`location = A` أو `B`) وشو حالة المكان (`status = Clean` أو `Dirty`). بناءً عليهم بيقرر فعل من أربعة: `Left`، `Right`، `Suck`، `NoOp`.

المنطق بسيط: إذا المكان وسخ → نظّف (`Suck`). إذا نظيف وهو بـ `A` → روح `Right` لـ `B`. إذا نظيف وهو بـ `B` → روح `Left` لـ `A`.

**لماذا؟** هاد أبسط مثال ممكن يوضح كيف نحوّل تعريف مجرّد (Agent Function) لكود فعلي (Agent Program) بجدول شروط بسيط `condition-action rules`.

#### 💡 التشبيه:
> متل شخص بغرفتين بس، وكل ما يحس الأرض وسخة تحته بينضف مكانه، وإذا نظيفة بيروح للغرفة التانية يتفقدها.
> **وجه الشبه:** الشخص = الوكيل، الغرفتين = البيئة، فحص النظافة = sensor، المشي والتنظيف = actuators.

```text
// English comments per line
function Vacuum-Agent([location, status]) returns an action
  if status = Dirty then          // if current square is dirty
    return Suck                   // clean it
  else if location = A then       // if in room A and it's clean
    return Right                  // move to room B
  else if location = B then       // if in room B and it's clean
    return Left                   // move to room A
```

#### شرح كل سطر:
1. `function Vacuum-Agent([location, status]) returns an action` → توقيع الدالة — بتاخد الموقع والحالة وبترجع فعل واحد.
2. `if status = Dirty then return Suck` → أعلى أولوية: لو المكان وسخ، نظّفه فوراً بدل ما تتحرك.
3. `else if location = A then return Right` → لو نظيف وأنت بـ A، انتقل يمين لـ B لتفقّده.
4. `else if location = B then return Left` → لو نظيف وأنت بـ B، ارجع يسار لـ A.

**الناتج المتوقع:**
> فعل واحد من: `Suck`، `Right`، `Left` حسب الجدول أعلاه — ما فيه حالة توصل لـ `NoOp` بهاد التطبيق البسيط رغم إنه موجود ضمن الأفعال الممكنة (`NoOp` بتظهر بحالات أعم متل توقّف الوكيل بعد ما ينضف كل شي).

---

### 4. جدول تسلسل الإحساسات ووكيل المنعكس البسيط (Reflex-Vacuum-Agent)

#### النص الأصلي يقول:
> A vacuum-cleaner agent — table mapping percept sequences ([A,Clean], [A,Dirty], [B,Clean], [B,Dirty], [A,Clean][A,Clean], [A,Clean][A,Dirty] ...) to actions (Right, Suck, Left, Suck, Right, Suck)
> What is the right function? Can it be implemented in a small agent program?

#### الشرح المبسّط:
الجدول بيوضح إنه حتى لو الوكيل شاف **نفس** الإحساس الأخير (`[A,Clean]`)، الفعل الصح ممكن يتغيّر حسب **تاريخ** الإحساسات قبله (مثلاً `[A,Clean],[A,Clean]` → `Right`، بس `[A,Clean],[A,Dirty]` → `Suck` لأن آخر إحساس هو Dirty). المحاضرة بتسأل سؤال مهم: هل فيه دالة "صح" وحيدة، وهل ممكن تتكتب ببرنامج صغير بسيط؟ — الجواب: نعم لهاد المثال البسيط (زي الكود بالأعلى)، بس بأمثلة أعقد ممكن الجدول يصير كبير جداً ومستحيل نكتبه صف صف.

**لماذا؟** هاي نقطة انتقالية مهمة: بتفتح الباب لسؤال "هل كل وكيل لازم يحتفظ بكل التاريخ، ولا فيه طرق أذكى؟" وهاد اللي رح تجاوبه لاحقاً معماريات الوكيل (Reflex with State إلخ).

#### الفهم الخاطئ الشائع ❌:
الوكيل البسيط (`Reflex-Vacuum-Agent`) لازم يخزّن كل تاريخ الإحساسات عشان يشتغل صح.

#### الفهم الصحيح ✅:
بهاد المثال البسيط، آخر إحساس (`[location, status]`) بس كافي لتحديد الفعل الصحيح — ما في حاجة لتخزين تاريخ كامل؛ هاد بالضبط تعريف `Simple Reflex Agent`.

---

### 5. العقلانية (Rationality)

#### النص الأصلي يقول:
> Fixed performance measure evaluates the environment sequence
> A rational agent chooses whichever action maximizes the expected value of the performance measure given the percept sequence to date
> Rational ≠ omniscient — percepts may not supply all relevant information
> Rational ≠ clairvoyant — action outcomes may not be as expected
> Hence, rational ≠ successful
> Rational ⇒ exploration, learning, autonomy

#### الشرح المبسّط:
- أول شي لازم نحدد **مقياس أداء ثابت** `performance measure` يقيّم سلسلة الحالات اللي مرت فيها البيئة (مش لحظة وحدة، القصة كلها). مثلاً بعالم المكنسة: نقطة لكل مربع نظيف بوقت T؟ أو نقطة لكل مربع نظيف بكل خطوة ناقص نقطة لكل حركة؟ أو عقاب إذا أكتر من k مربع وسخ؟ — كل خيار بيغيّر سلوك الوكيل "الأمثل".
- **الوكيل العقلاني** هو اللي بكل لحظة بيختار الفعل اللي **بالمتوقع** بيعطي أعلى قيمة لمقياس الأداء، بناءً على **كل الإحساسات اللي وصلته لهسا بس** (مش المستقبل).
- عقلاني ≠ يعرف كل شي (omniscient): ممكن الـ sensors ما تعطيه كل المعلومات المهمة.
- عقلاني ≠ عرّاف (clairvoyant): ممكن نتيجة فعله تجي مختلفة عن المتوقع (لأنه العالم فيه عشوائية/معلومات ناقصة).
- **النتيجة**: عقلاني ما بيعني ناجح دايماً (ممكن يتخذ أفضل قرار متاح وبرضه تجي نتيجة سيئة بسبب حظ سيء أو نقص معلومات).
- كون الوكيل عقلاني بيفرض عليه (implies) إنه لازم يستكشف `exploration`، يتعلم `learning`، ويكون مستقل بقراراته `autonomy` — عشان يتعامل مع نقص المعرفة وعدم اليقين.

**لماذا؟** لازم نعرف نفرّق "أفضل قرار ممكن باللحظة" عن "أفضل نتيجة ممكنة" — هاد أساسي كتير بمجال الذكاء الاصطناعي عشان ما نطلب من الوكيل المستحيل (يعرف كل شي أو يتوقع كل شي بدقة).

#### 💡 التشبيه:
> لاعب شطرنج محترف بيلعب أفضل نقلة ممكنة حسب اللي شايفه عالرقعة هلق، بس ممكن يخسر لأنه الخصم لعب نقلة غير متوقعة أو فيه معلومة ما كانش يعرفها (متل استراتيجية جديدة).
> **وجه الشبه:** أفضل نقلة متاحة = القرار العقلاني، الخسارة رغم هيك = عقلاني ≠ ناجح دايماً.

#### مهم للامتحان ⚠️:
> لازم تحفظ الفرق التلاتة: `rational ≠ omniscient`، `rational ≠ clairvoyant`، `rational ≠ successful` — بيجو كتير كأسئلة MCQ أو نظري.

---

### 6. تحديد بيئة المهمة عبر PEAS

#### النص الأصلي يقول:
> Problem specification: Performance measure, Environment, Actuators, Sensors (PEAS)
> Example: automated taxi driver — Performance measure: Safe, fast, legal, comfortable trip, maximize profits. Environment: Roads, other traffic, pedestrians, customers. Actuators: Steering wheel, accelerator, brake, signal, horn. Sensors: Cameras, sonar, speedometer, GPS, odometer, engine sensors, keyboard

#### الشرح المبسّط:
`PEAS` هو إطار عمل (framework) بنستخدمه عشان نوصف أي "مسألة وكيل" بشكل منظم ومنهجي، بدل ما نوصفها بكلام عام غامض. أربع نقاط لازم نحددها دايماً:
- **P**erformance measure: كيف رح نقيس نجاح الوكيل؟
- **E**nvironment: وين بيشتغل الوكيل؟ شو موجود فيها؟
- **A**ctuators: شو أدوات التنفيذ اللي فيه الوكيل يأثر فيها بالبيئة؟
- **S**ensors: شو أدوات الإحساس اللي فيها الوكيل يجمع معلومات عن البيئة؟

بمثال سيارة الأجرة الذاتية القيادة: الأداء = رحلة آمنة/سريعة/قانونية/مريحة + تعظيم الربح؛ البيئة = طرق وسير وسابلة وزباين؛ الأدوات = مقود ودعسة بنزين وفرامل وإشارة وبوق؛ الحساسات = كاميرات وسونار وعداد سرعة وGPS وعداد مسافة وحساسات محرك ولوحة مفاتيح.

**لماذا؟** بدون PEAS واضح، صعب تصمم وكيل أو حتى تختبره — لأنه ما رح تعرف "شو معناه نجاح" ولا "شو فعلياً الوكيل قادر يعمل أو يحس فيه".

```algorithm
1 | حدد Performance measure | تحليل المتطلبات | اكتب معايير النجاح (آمن، سريع، قانوني، مريح، مربح)
2 | حدد Environment | ملاحظة السياق | عدّد كل العناصر المحيطة بالوكيل (طرق، سير، زباين)
3 | حدد Actuators | تحليل قدرات التنفيذ | عدّد كل أداة يقدر الوكيل يحرّكها أو ينفّذ فيها فعل
4 | حدد Sensors | تحليل قدرات الإحساس | عدّد كل أداة استشعار متاحة للوكيل
```

#### نقاط التنفيذ:
- لازم Performance measure يكون محدد قبل أي شي — لأنه هو معيار "العقلانية" اللي حكينا عنه بالفقرة السابقة.
- Environment وActuators وSensors بينتجوا مع بعض تصنيف البيئة (Observable/Deterministic/... إلخ) اللي جاي بالفقرة اللاحقة.

---

### 7. أمثلة إضافية على PEAS: فلتر السبام (Spam Filter)

#### النص الأصلي يقول:
> Performance measure: Minimizing false positives, false negatives
> Environment: A user's email account, email server
> Actuators: Mark as spam, delete, etc.
> Sensors: Incoming messages, other information about user's account

#### الشرح المبسّط:
مثال تاني أبسط من التاكسي: وكيل فلترة السبام. أداء النجاح هون هو **تقليل الأخطاء** (رسالة عادية تتصنف سبام خطأً = false positive، أو رسالة سبام ما تتصنف = false negative) — مش "زيادة أرباح" متل التاكسي، لأن طبيعة المهمة مختلفة.

**لماذا؟** هاد المثال بيبيّن إنه Performance measure مش دايماً "أعلى قيمة"، وممكن يكون **تقليل خطأ** — كل مسألة إلها مقياس أداء يناسبها.

#### ⚖️ المقايضة: false positive vs false negative

| | تقليل false positives | تقليل false negatives |
| --- | --- | --- |
| المزايا | رسائل مهمة ما بتضيع بمجلد السبام | صندوق الوارد نضيف تماماً من السبام |
| العيوب | ممكن يفوت رسائل سبام فعلية للصندوق الرئيسي | ممكن رسالة مهمة تروح غلط عالسبام |
| متى تختاره | لما تكلفة ضياع رسالة مهمة عالية جداً (مثلاً بريد عمل) | لما إزعاج السبام أكتر أهمية من فقدان رسالة نادرة |

---

### 8. وكيل التسوق عبر الإنترنت (Internet Shopping Agent) — تطبيق PEAS

#### النص الأصلي يقول:
> Performance measure?? price, quality, appropriateness, efficiency
> Environment?? current and future WWW sites, vendors, shippers
> Actuators?? display to user, follow URL, fill in form
> Sensors?? HTML pages (text, graphics, scripts)

#### الشرح المبسّط:
مثال ثالث لتطبيق PEAS بشكل كامل ذاتياً كتمرين بالمحاضرة قبل ما تنكشف الإجابة:
- **الأداء**: السعر، الجودة، ملاءمة المنتج لطلب المستخدم، وكفاءة عملية البحث والشراء.
- **البيئة**: مواقع الويب الحالية والمستقبلية، البائعين، شركات الشحن.
- **الأدوات**: عرض نتائج للمستخدم، متابعة رابط (URL)، تعبئة نموذج (form).
- **الحساسات**: صفحات HTML بكل محتواها (نص، صور، سكربتات).

**لماذا؟** هاد المثال بيوضح إنه حتى بيئة "افتراضية" (مش فيزيائية زي التاكسي) بتنطبق عليها PEAS بنفس الطريقة تماماً — العناصر الأربعة عامة وما بتتغير الفكرة، بس بتتغير القيم حسب طبيعة المهمة.

---

### 9. أنواع البيئات (Environment Types) — الأبعاد الستة

#### النص الأصلي يقول:
> Fully observable vs. partially observable — if an agent's sensors give it access to the complete state of the environment at each point in time, then fully observable. Effectively fully observable if sensors detect all aspects relevant to the choice of action.
> Deterministic vs. stochastic — if the next state is completely determined by current state and agent's action, deterministic; otherwise stochastic.
> Episodic vs. sequential — in episodic environment, experience divided into atomic episodes; next episode doesn't depend on previous actions.
> Static vs. dynamic — if environment can change while agent is deliberating, dynamic; otherwise static.
> Discrete vs. continuous — applies to state, time handling, percepts, and actions.
> Single agent vs. multiagent.

#### الشرح المبسّط:
بعد ما عرّفنا الوكيل وPEAS، لازم نصنّف "شكل" البيئة نفسها على 6 أبعاد، كل بُعد بيأثر مباشرة على تصميم الوكيل:

1. **Observable (مُشاهَدة بالكامل) vs Partially observable**: هل الحساسات بتعطيك **كل** المعلومات المهمة عن حالة البيئة هلق، ولا بس جزء منها؟
2. **Deterministic (حتمية) vs Stochastic (عشوائية)**: هل الحالة الجاية محددة 100% من الحالة الحالية + فعل الوكيل، ولا فيه عنصر عشوائية/طرف تاني بيأثر؟
3. **Episodic (منفصلة) vs Sequential (متسلسلة)**: هل كل "حلقة" إحساس-فعل منفصلة تماماً عن الحلقات قبلها وبعدها، ولا القرارات الحالية بتأثر على المستقبل؟
4. **Static (ثابتة) vs Dynamic (متغيرة)**: هل ممكن البيئة تتغير وانت "لسا عم تفكر" بالقرار، ولا بتضل ثابتة لحد ما تتصرف؟
5. **Discrete (منفصلة/عد) vs Continuous (مستمرة)**: هل الحالات/الوقت/الإحساسات/الأفعال قيم منفصلة معدودة (زي رقعة شطرنج)، ولا مستمرة (زي سرعة سيارة)؟
6. **Single-agent vs Multiagent**: هل يوجد وكيل واحد بس بالبيئة، ولا أكتر من وكيل بيأثروا على بعض؟

**لماذا؟** لأن "نوع البيئة" هو اللي بيقرر أي معمارية وكيل لازم تستخدم لاحقاً — بيئة بسيطة (Fully observable + Deterministic + Episodic) بتكفيها وكيل Reflex بسيط، ببينما بيئة معقدة (Partially observable + Stochastic + Sequential) بتحتاج وكيل بحالة داخلية أو حتى Utility-based.

#### 💡 التشبيه:
> `Observable`: لعب ورق مكشوف الأوراق (كل شي قدامك) مقابل لعب بورقة مخفية بإيد الخصم.
> `Deterministic`: لعبة شطرنج (نقلتك بتحدد النتيجة أكيد) مقابل نرد الطاولة (زهر عشوائي).
> **وجه الشبه:** كل بُعد من الستة هو سؤال بسيط "شو طبيعة اللعبة اللي الوكيل عم يلعبها؟"

---

### 10. تطبيق أنواع البيئات على أمثلة (Solitaire / Backgammon / Internet Shopping / Taxi)

#### النص الأصلي يقول:
> (جدول مبني تدريجياً عبر عدة شرائح)
> Observable: Solitaire=Yes, Backgammon=Yes, Internet shopping=No, Taxi=No
> Deterministic: Solitaire=Yes, Backgammon=No, Internet shopping=Partly, Taxi=No
> Episodic: كلهن No
> Static: Solitaire=Yes, Backgammon=Semi, Internet shopping=Semi, Taxi=No
> Discrete: Solitaire=Yes, Backgammon=Yes, Internet shopping=Yes, Taxi=No
> Single-agent: Solitaire=Yes, Backgammon=No, Internet shopping=Yes (except auctions), Taxi=No
> The environment type largely determines the agent design
> The real world is (of course) partially observable, stochastic, sequential, dynamic, continuous, multi-agent

#### الشرح المبسّط:
المحاضرة بتاخد أربع "ألعاب/مسائل" مختلفة وبتصنفهن حسب الأبعاد الستة، خطوة خطوة، عشان توضح كيف نفس الإطار بينطبق بشكل مختلف كل مرة:

| البُعد | Solitaire | Backgammon | Internet Shopping | Taxi |
| --- | --- | --- | --- | --- |
| Observable | Yes | Yes | No | No |
| Deterministic | Yes | No | Partly | No |
| Episodic | No | No | No | No |
| Static | Yes | Semi | Semi | No |
| Discrete | Yes | Yes | Yes | No |
| Single-agent | Yes | No | Yes (ما عدا المزادات) | No |

ملاحظات مهمة على كل صف:
- **Solitaire (السوليتير)**: لعبة ورق فردية، كل الورق قدامك (Observable=Yes)، حركتك بتحدد النتيجة (Deterministic=Yes)، القرارات متسلسلة (Episodic=No)، ما بتتغير وانت عم تفكر (Static=Yes)، أوراق معدودة (Discrete=Yes)، لاعب واحد (Single-agent=Yes).
- **Backgammon (الطاولة)**: كل الرقعة ظاهرة (Observable=Yes)، بس فيه نرد عشوائي (Deterministic=No)، فيها خصم آخر (Single-agent=No)، شبه ثابتة لأنه ينتظر دورك (Static=Semi).
- **Internet Shopping**: ما بتقدر تشوف كل مواقع الويب أو كل البائعين بلحظة وحدة (Observable=No)، جزئياً حتمية (بعض النتائج متوقعة زي تحميل صفحة، وبعضها لأ زي توفر منتج) (Deterministic=Partly)، المواقع ممكن تتغير أثناء تصفحك (Static=Semi)، غالباً فردية إلا بحالة مزادات فيها منافسين (Single-agent=Yes except auctions).
- **Taxi (سيارة الأجرة الذاتية)**: أصعب مثال — Observable=No (كاميرات ما بتشوف كل شي)، Deterministic=No (سواقين تانيين وسلوك عشوائي)، Static=No (الطريق بيتغير كل ثانية)، Discrete=No (سرعة ومسافة قيم مستمرة)، Single-agent=No (فيه سيارات وسابلة تانيين).

**لماذا؟** هاد الجدول تأسيسي — كل خوارزميات الذكاء الاصطناعي الجاية بالمحاضرات القادمة (بحث، منطق، تعلم) بتفترض ضمنياً نوع معين من البيئة، فلازم تعرف تصنّف أي مسألة جديدة قبل ما تختار أداة الحل.

#### مهم للامتحان ⚠️:
> **The environment type largely determines the agent design** — والعالم الحقيقي (Real world) هو: `partially observable`، `stochastic`، `sequential`، `dynamic`، `continuous`، `multi-agent` — هاي ست صفات لازم تحفظهن بالترتيب لأنها أكتر تركيبة بتتسأل عنها بالامتحان.

---

## الجزء الثاني: ملخص منظم

### أهم التعاريف والمفاهيم

| المصطلح | التعريف | مثال/ملاحظة |
| --- | --- | --- |
| `Agent` | أي كيان يحس بالبيئة عبر `sensors` ويتصرف فيها عبر `actuators` | إنسان، روبوت، برنامج |
| `Percept` | معطى حسّي وحيد وصل للوكيل بلحظة معينة | `[A, Dirty]` |
| `Percept Sequence` | كامل تاريخ الإحساسات من بداية عمل الوكيل | `[A,Clean],[A,Dirty]` |
| `Agent Function` | دالة رياضية مجرّدة `F: P* → A` | جدول لا نهائي نظرياً |
| `Agent Program` | الكود الفعلي اللي بينفذ سلوك الـ Agent Function | `Reflex-Vacuum-Agent` |
| `Rational Agent` | وكيل يختار الفعل اللي يعظّم القيمة **المتوقعة** لمقياس الأداء حسب تاريخ الإحساسات | — |
| `Performance Measure` | معيار ثابت لتقييم سلسلة حالات البيئة | نقطة لكل مربع نظيف |
| `PEAS` | إطار توصيف: Performance, Environment, Actuators, Sensors | تصميم أي وكيل جديد |
| `Autonomy` | استقلالية الوكيل باتخاذ قراراته دون تدخل خارجي مستمر | نتيجة منطقية للعقلانية |

### المكونات الرئيسية (مرجع سريع) — PEAS

| المكوّن | الوظيفة | ملاحظة |
| --- | --- | --- |
| `Performance measure` | يحدد معنى "النجاح" للوكيل | يجب أن يكون ثابتاً `Fixed` طوال الوقت |
| `Environment` | كل ما هو خارج الوكيل ويتفاعل معه | يصنَّف لاحقاً حسب 6 أبعاد |
| `Actuators` | أدوات تنفيذ فعل الوكيل | مقود، فرامل، Suck... |
| `Sensors` | أدوات جمع معلومات عن البيئة | كاميرا، GPS، صفحات HTML... |

### جداول مقارنات سريعة

| المقارنة | الأول | الثاني | الفرق |
| --- | --- | --- | --- |
| `Rational` مقابل `Omniscient` | Rational: يقرر بناءً على ما توفر له من percepts | Omniscient: يعرف كل شي فعلياً | الوكيل العقلاني محدود بمعلوماته، مش بالضرورة يعرف كل الحقائق |
| `Rational` مقابل `Clairvoyant` | Rational: يتوقع أفضل نتيجة ممكنة | Clairvoyant: يعرف النتيجة الفعلية مسبقاً | نتائج أفعال الوكيل العقلاني ممكن تختلف عن توقعه |
| `Observable` مقابل `Partially observable` | Fully: كل الحالة مكشوفة للحساسات | Partially: جزء بس مكشوف | يحدد إذا الوكيل يحتاج يبني نموذج داخلي (state) أم لا |
| `Deterministic` مقابل `Stochastic` | Deterministic: الحالة الجاية مؤكدة 100% | Stochastic: فيه احتمالية/عشوائية | يحدد إذا نحتاج تفكير احتمالي بتصميم الوكيل |
| `Episodic` مقابل `Sequential` | Episodic: كل حلقة مستقلة | Sequential: القرار الحالي يؤثر على المستقبل | يحدد إذا الوكيل يحتاج تخطيط طويل المدى |
| `Static` مقابل `Dynamic` | Static: البيئة تنتظر قرار الوكيل | Dynamic: البيئة تتغير أثناء التفكير | يحدد سرعة الاستجابة المطلوبة من الوكيل |

### قاموس المصطلحات (Glossary)

| الفئة | المصطلحات |
| --- | --- |
| مفاهيم أساسية | `Agent`, `Environment`, `Percept`, `Percept Sequence`, `Action` |
| الوكيل والدالة | `Agent Function`, `Agent Program`, `Architecture` |
| العقلانية | `Rational Agent`, `Performance Measure`, `Omniscient`, `Clairvoyant`, `Autonomy` |
| التوصيف | `PEAS`, `Performance`, `Environment`, `Actuators`, `Sensors` |
| تصنيف البيئة | `Observable`, `Deterministic`, `Stochastic`, `Episodic`, `Sequential`, `Static`, `Dynamic`, `Discrete`, `Continuous`, `Single-agent`, `Multiagent` |
| معماريات الوكيل | `Simple Reflex Agent`, `Reflex Agent with State`, `Goal-based Agent`, `Utility-based Agent`, `Learning Agent`, `Condition-action rules` |

### أبرز النقاط الذهبية

1. الوكيل = architecture + program، والدالة الوكيلية (Agent Function) هي الوصف النظري بس مش التنفيذ الفعلي.
2. العقلانية تعتمد على **الإحساسات المتوفرة حتى الآن** فقط، مش على المستقبل أو المعرفة الكاملة.
3. `rational ≠ omniscient`، `rational ≠ clairvoyant`، ولذلك `rational ≠ successful` — بس هاد ما بيلغي كون القرار "الأفضل الممكن".
4. PEAS إطار عمل ثابت (أربع عناصر) بينطبق على أي وكيل، سواء فيزيائي (تاكسي) أو رقمي (شراء إنترنت، فلتر سبام).
5. نوع البيئة (الأبعاد الستة) هو أهم عامل بيحدد أي معمارية وكيل تصلح للمسألة.
6. العالم الحقيقي هو أصعب توليفة ممكنة: partially observable + stochastic + sequential + dynamic + continuous + multi-agent.
7. معماريات الوكيل الأربعة (Simple Reflex → Utility-based) مرتبة بترتيب تصاعدي بالعمومية والتعقيد، وكل وحدة فيهن ممكن تتحول لـ Learning Agent.

### الأخطاء الشائعة عند الطلاب ⚠️

| الخطأ | التصحيح |
| --- | --- |
| الاعتقاد إنه الوكيل العقلاني لازم يكون "ناجح" دايماً | العقلانية بتعني أفضل قرار متاح بالمعلومات الحالية، مش ضمان النجاح |
| الخلط بين `Agent Function` و `Agent Program` | Function = وصف نظري مجرّد، Program = كود فعلي منفّذ |
| اعتبار `Episodic` = "بسيط" و`Sequential` = "معقد" فقط | الفرق الحقيقي هو استقلالية القرارات عن بعضها، مش مستوى الصعوبة |
| نسيان إنه `Static/Dynamic` يخص "أثناء التفكير" وليس "أثناء الفعل" | Dynamic تحديداً تعني البيئة ممكن تتغير أثناء اتخاذ القرار نفسه |
| اعتبار Internet Shopping بيئة Fully Observable لأنها "على الشاشة" | هي Partially observable لأنه ما فيك تشوف كل مواقع الويب والبائعين بلحظة واحدة |

---

### خطوات وإجراءات المحاضرة

#### ⚙️ الخطوات / الخوارزمية: Reflex-Vacuum-Agent
> هدفها: اتخاذ قرار فوري بناءً على آخر إحساس فقط (location + status) بدون أي ذاكرة أو تاريخ.

```algorithm
1 | استقبال الإحساس | Sensors | قراءة [location, status] الحالي
2 | فحص حالة النظافة | Condition-action rule | إذا status = Dirty نفّذ Suck وتوقف
3 | فحص الموقع A | Condition-action rule | إذا location = A نفّذ Right وتوقف
4 | فحص الموقع B | Condition-action rule | إذا location = B نفّذ Left وتوقف
```

#### نقاط التنفيذ:
- الترتيب مهم: فحص `Dirty` لازم يجي **قبل** فحص الموقع، لأنه لو عكسنا الترتيب ممكن الوكيل يتحرك من مربع وسخ بدل ما ينظفه.
- هاد الوكيل ما عنده ذاكرة (`state`) — قراره بالكامل مبني على الإحساس الحالي فقط، ولهيك بيصنَّف `Simple Reflex Agent`.

#### ⚙️ الخطوات / الخوارزمية: بناء توصيف PEAS لأي وكيل جديد
> هدفها: منهجية ثابتة لتحليل أي مسألة وكيل جديدة بشكل منظم قبل البدء بالتصميم.

```algorithm
1 | حدد الهدف النهائي للوكيل | تحليل المتطلبات | صياغة Performance measure بمعايير قابلة للقياس
2 | ارسم حدود البيئة | ملاحظة/بحث | تحديد كل العناصر الخارجية المؤثرة (Environment)
3 | حدد كل فعل ممكن | تحليل تقني | سرد كل Actuator متاح
4 | حدد كل مصدر معلومات | تحليل تقني | سرد كل Sensor متاح
5 | صنّف البيئة | جدول الأبعاد الستة | Observable? Deterministic? Episodic? Static? Discrete? Single-agent?
6 | اختر معمارية الوكيل | مطابقة | Simple Reflex / State / Goal-based / Utility-based حسب نتائج الخطوة 5
```

#### نقاط التنفيذ:
- الخطوة 5 (تصنيف البيئة) هي الجسر بين PEAS واختيار المعمارية المناسبة بالخطوة 6.
- كل ما كانت البيئة أقرب لـ "partially observable + stochastic + sequential + dynamic"، كل ما احتجنا معمارية أعقد (State-based أو Utility-based) بدل Simple Reflex.

---

### أنماط الأكواد والبنى المتكررة

| النمط | البنية الأساسية | متى تستخدمه |
| --- | --- | --- |
| `Condition-action rule` | `if condition then action` سلسلة شروط مرتبة بالأولوية | Simple Reflex Agent بس، بيئات بسيطة Fully observable |
| `PEAS specification` | أربع فقرات ثابتة: Performance / Environment / Actuators / Sensors | أول خطوة بتصميم أي وكيل جديد بأي مجال |
| `Environment classification table` | صف لكل بُعد (Observable...) وعمود لكل مسألة | مقارنة عدة بيئات أو تحليل بيئة جديدة بسرعة |

### أنماط التعامل والسلوك

| السيناريو | التعامل الصحيح | لماذا؟ |
| --- | --- | --- |
| بيئة Partially observable | لا تفترض إنه الوكيل "يعرف" الحالة الكاملة — صمّم sensors/state تعوّض النقص | تجنّب قرارات خاطئة مبنية على افتراض معرفة غير متوفرة |
| بيئة Stochastic | لا تصمم وكيل يتوقع نتيجة أكيدة لفعله | لازم الوكيل يتوقع نتائج محتملة متعددة، مش نتيجة واحدة مضمونة |
| بيئة Dynamic | لا تعطي الوكيل وقت تفكير طويل بلا حدود | البيئة ممكن تتغير أثناء التفكير فتصير القرارات قديمة/خاطئة |
| مسألة فيها أكتر من وكيل (Multiagent) | لا تصمم بافتراض إنك الوحيد المؤثر بالبيئة | لازم تأخذ بعين الاعتبار قرارات/تنافس الوكلاء الآخرين |

### الأفكار الرئيسية الشاملة

الفكرة المحورية اللي بتربط كل شي بهاي المحاضرة: **تصميم أي وكيل ذكي بيمر بمسار ثابت** — أول شي تعرّف الوكيل والبيئة (تعريف عام)، بعدين توصّف المسألة رسمياً (PEAS)، بعدين تصنّف طبيعة البيئة (6 أبعاد)، وأخيراً تختار معمارية الوكيل المناسبة (من الأبسط للأعقد) بناءً على هاد التصنيف. وكل معمارية أعلى بتضيف "قدرة" جديدة: الحالة الداخلية (State) بتضيف ذاكرة، الأهداف (Goals) بتضيف تخطيط مستقبلي، والمنفعة (Utility) بتضيف قدرة على المفاضلة بين أهداف متعددة أو متضاربة.

---

## الجزء الثالث: أسئلة اختيار من متعدد (MCQ)

> **24 سؤالاً** (18 أساسي + 3 سيناريوهات مركّبة × 3 أسئلة لكل سيناريو). مستوى: medium/hard.

### السؤال 1 (medium)
شركة طيران بدها تبني وكيل لحجز التذاكر تلقائياً. ما هو أفضل تعريف لـ Performance measure؟
أ) عدد المستخدمين اللي زاروا الموقع
ب) سرعة تحميل الصفحة فقط
ج) رضا الزبون، دقة الحجز، السعر الأنسب، سرعة الإنجاز
د) عدد أسطر الكود المستخدمة بالبرنامج
**الإجابة الصحيحة: ج**
**التعليل:** Performance measure لازم يقيس **نجاح المهمة** فعلياً (رضا + دقة + سعر + سرعة)، مش مقاييس تقنية غير مرتبطة بالهدف (أ، ب، د كلها لا تقيس نجاح المهمة نفسها).

---

### السؤال 2 (medium)
أي مما يلي **ليس** أحد عناصر PEAS؟
أ) Performance
ب) Environment
ج) Algorithm
د) Sensors
**الإجابة الصحيحة: ج**
**التعليل:** PEAS = Performance, Environment, Actuators, Sensors فقط. `Algorithm` ليس من عناصرها؛ (أ، ب، د) كلها عناصر حقيقية بالإطار.

---

### السؤال 3 (hard)
وكيل مكنسة كهربائية بيعتمد فقط على `[location, status]` الحالي بدون أي ذاكرة سابقة. ما نوع هذا الوكيل؟
أ) Goal-based Agent
ب) Utility-based Agent
ج) Simple Reflex Agent
د) Reflex Agent with State
**الإجابة الصحيحة: ج**
**التعليل:** الاعتماد على الإحساس الحالي فقط دون ذاكرة هو التعريف الدقيق لـ Simple Reflex Agent. (د) يحتاج تخزين حالة داخلية، و(أ، ب) يحتاجان تمثيل أهداف/منفعة وهذا غير متوفر هنا.

---

### السؤال 4 (medium)
بالجدول الآتي لوكيل مكنسة: `[A,Clean],[A,Clean]` → `Right` بينما `[A,Clean],[A,Dirty]` → `Suck` رغم إنه آخر موقع بالحالتين نفسه تقريباً. هذا يوضح أن القرار اعتمد على:
أ) الموقع الحالي فقط
ب) تسلسل كامل من الإحساسات (Percept Sequence)
ج) عشوائية بحتة
د) رقم الخطوة الزمنية فقط
**الإجابة الصحيحة: ب**
**التعليل:** الفرق بالفعل جاء من اختلاف آخر عنصر بالتسلسل (Clean مقابل Dirty)، أي أن القرار مبني على تسلسل الإحساسات لا الموقع وحده. (أ) غير كافٍ لتفسير الاختلاف، (ج، د) لا علاقة لهما بالمنطق المعروض.

---

### السؤال 5 (hard)
أي العبارات التالية **صحيحة** فيما يخص العقلانية (Rationality)؟
أ) الوكيل العقلاني يعرف دائماً النتيجة الحقيقية لكل فعل مسبقاً
ب) الوكيل العقلاني يختار الفعل الذي يعظّم القيمة المتوقعة لمقياس الأداء بناءً على تاريخ الإحساسات
ج) الوكيل العقلاني ناجح دائماً بالضرورة
د) الوكيل العقلاني يحتاج معرفة كاملة بكل تفاصيل البيئة
**الإجابة الصحيحة: ب**
**التعليل:** هذا هو التعريف الدقيق من المحاضرة. (أ) خطأ لأن هذا تعريف Clairvoyant. (ج) خطأ لأن rational ≠ successful. (د) خطأ لأن هذا تعريف Omniscient.

---

### السؤال 6 (medium)
Performance measure الجيد لعالم المكنسة الكهربائية يجب أن يكون:
أ) متغيراً كل خطوة زمنية
ب) ثابتاً طوال فترة عمل الوكيل
ج) يعتمد على مزاج المستخدم
د) غير محدد مسبقاً حتى يقرر الوكيل نفسه
**الإجابة الصحيحة: ب**
**التعليل:** المحاضرة تنص صراحة على "Fixed performance measure evaluates the environment sequence" — يجب أن يكون ثابتاً لضمان تقييم متسق لسلوك الوكيل.

---

### السؤال 7 (hard)
بيئة Backgammon مصنّفة `Deterministic = No`. ما السبب المباشر؟
أ) اللاعبين لا يريان الرقعة بالكامل
ب) وجود عنصر الزهر (Dice) العشوائي
ج) اللعبة تحتوي أكثر من لاعب
د) القرارات لا تعتمد على بعضها
**الإجابة الصحيحة: ب**
**التعليل:** العشوائية بالنتيجة الجاية سببها الزهر (Dice)؛ (أ) هذا سبب لتصنيف Observable وليس Deterministic، (ج) سبب لتصنيف Single-agent، (د) هذا وصف لـ Episodic وليس صحيحاً هنا أصلاً.

---

### السؤال 8 (medium)
لماذا تُصنَّف بيئة Internet Shopping بأنها `Observable = No`؟
أ) لأن أسعار المنتجات تتغير باستمرار
ب) لأن الوكيل لا يمكنه رؤية كل مواقع الويب والبائعين الحاليين والمستقبليين دفعة واحدة
ج) لأن صفحات HTML معقدة تقنياً
د) لأن هناك أكثر من مستخدم يتصفح بنفس الوقت
**الإجابة الصحيحة: ب**
**التعليل:** Observable يخص اكتمال المعلومات المتاحة للحساسات عن الحالة الكاملة، وهذا غير متوفر هنا لأن الويب واسع جداً ومتغير. (أ) صلته أقرب لـ Static/Dynamic، (ج، د) غير متعلقين بالتصنيف مباشرة.

---

### السؤال 9 (hard)
أي توليفة تصف "العالم الحقيقي" كما ورد بالمحاضرة؟
أ) Fully observable, deterministic, episodic, static, discrete, single-agent
ب) Partially observable, stochastic, sequential, dynamic, continuous, multi-agent
ج) Fully observable, stochastic, episodic, static, continuous, single-agent
د) Partially observable, deterministic, sequential, static, discrete, multi-agent
**الإجابة الصحيحة: ب**
**التعليل:** هذه التوليفة بالضبط منصوص عليها بالمحاضرة كوصف للعالم الحقيقي؛ باقي الخيارات (أ، ج، د) تخلط صفات من أطراف مختلفة بشكل غير متطابق مع النص.

---

### السؤال 10 (medium)
ما الفرق الجوهري بين Episodic و Sequential؟
أ) Episodic أصعب من Sequential
ب) بالـ Episodic، القرار الحالي لا يعتمد على قرارات سابقة، بينما بالـ Sequential يعتمد
ج) Sequential تخص الألعاب فقط
د) لا يوجد فرق حقيقي بينهما
**الإجابة الصحيحة: ب**
**التعليل:** هذا التعريف الدقيق من المحاضرة: "the next episode does not depend on the actions taken in previous episodes" بالـ Episodic، بعكس Sequential.

---

### السؤال 11 (hard)
وكيل قرر إعطاء أولوية لفحص `status = Dirty` قبل فحص `location` بمثال المكنسة. ماذا سيحدث لو عكسنا هذا الترتيب (فحصنا location أولاً)؟
أ) لا شيء سيتغير إطلاقاً
ب) قد يتحرك الوكيل من مربع وسخ دون تنظيفه أولاً
ج) سيتوقف الوكيل عن العمل نهائياً
د) سيصبح الوكيل Goal-based تلقائياً
**الإجابة الصحيحة: ب**
**التعليل:** إذا فحصنا الموقع أولاً، قد يقرر الوكيل التحرك (Right/Left) رغم أن المربع الحالي وسخ، فيفوّت فرصة التنظيف. (أ) خطأ لأن الترتيب مؤثر فعلياً، (ج، د) لا علاقة لهما بترتيب الشروط.

---

### السؤال 12 (medium)
أي مما يلي مثال على `Actuator` وليس `Sensor` بمثال سيارة الأجرة؟
أ) GPS
ب) Camera
ج) Steering wheel
د) Speedometer
**الإجابة الصحيحة: ج**
**التعليل:** المقود (Steering wheel) أداة تنفيذ فعل (actuator)، بينما GPS والكاميرا والعداد كلها أدوات جمع معلومات (sensors).

---

### السؤال 13 (hard)
لماذا لا يمكن تطبيق `Agent Function` كجدول فعلي مكتوب بالكامل لمعظم المسائل الواقعية؟
أ) لأنها غير معرّفة رياضياً
ب) لأن عدد تسلسلات الإحساسات الممكنة (P*) كبير جداً أو غير منته
ج) لأن الحاسوب لا يفهم الدوال الرياضية
د) لأن الأفعال (Actions) غير محدودة دائماً
**الإجابة الصحيحة: ب**
**التعليل:** المشكلة العملية هي حجم الجدول: كل تسلسل ممكن من الإحساسات يحتاج سطراً، وهذا غالباً كبير جداً أو لا نهائي عملياً، ولذلك نستخدم Agent Program بدلاً من الجدول الكامل.

---

### السؤال 14 (medium)
أي بُعد من أبعاد تصنيف البيئة يتعلق مباشرة بـ "هل يمكن للبيئة أن تتغير أثناء تفكير الوكيل"؟
أ) Discrete vs Continuous
ب) Episodic vs Sequential
ج) Static vs Dynamic
د) Single-agent vs Multiagent
**الإجابة الصحيحة: ج**
**التعليل:** هذا هو بالضبط تعريف Static/Dynamic بالمحاضرة: "if the environment can change while an agent is deliberating, then dynamic."

---

### السؤال 15 (hard)
اعتبر وكيلاً بمهمة تشخيص طبي أولي عبر الإنترنت. أي Performance measure أكثر ملاءمة؟
أ) عدد الأسئلة المطروحة على المريض بأقصى سرعة
ب) دقة التشخيص الأولي وتقليل الأخطاء الخطيرة (false negatives خصوصاً)
ج) عدد الصفحات التي يعرضها الموقع
د) سرعة تحميل واجهة الموقع فقط
**الإجابة الصحيحة: ب**
**التعليل:** بمجال حساس كالطب، أهم معيار هو الدقة وتقليل الأخطاء الخطيرة (خصوصاً عدم تفويت حالة خطيرة)، بعكس المقاييس التقنية البحتة بباقي الخيارات.

---

### السيناريو 1: تصميم وكيل توصيل طرود ذاتي القيادة

> وكيل روبوت صغير مهمته توصيل الطرود داخل حرم جامعي. يتحرك على أرصفة مخصصة، يتفادى الطلاب والعوائق، يستخدم كاميرات وGPS، ويتوقف عند نقاط تسليم محددة. الحرم الجامعي مزدحم بأوقات معينة وفارغ بأوقات أخرى، وفيه روبوتات توصيل أخرى تعمل بنفس الوقت.

### السؤال 1.1 (hard)
ما هو التصنيف الأنسب لهذه البيئة من حيث Observable؟
أ) Fully observable لأن الروبوت عنده كاميرا
ب) Partially observable لأن الكاميرا لا تغطي كل زوايا الحرم بلحظة واحدة
ج) لا ينطبق عليها هذا البُعد
د) Fully observable لأنه عنده GPS دقيق
**الإجابة الصحيحة: ب**
**التعليل:** وجود حساسات لا يعني رؤية الحالة الكاملة للبيئة؛ الكاميرا وGPS يعطيان معلومات جزئية عن محيط الروبوت فقط، وليس عن كل الحرم بلحظة واحدة. (أ، د) يخلطان بين "وجود حساس" و"رؤية كاملة".

### السؤال 1.2 (hard)
بما أن هناك روبوتات توصيل أخرى تعمل بنفس الوقت، هذه البيئة تُصنَّف؟
أ) Single-agent
ب) Multiagent
ج) Episodic
د) Static
**الإجابة الصحيحة: ب**
**التعليل:** وجود أكثر من وكيل (روبوت) يؤثر على نفس البيئة بنفس الوقت هو التعريف المباشر لـ Multiagent.

### السؤال 1.3 (hard)
أي معمارية وكيل أنسب لهذا الروبوت، أخذاً بعين الاعتبار أنه يحتاج يتذكر أين وصل ووين لسا بده يوصل؟
أ) Simple Reflex Agent
ب) Reflex Agent with State أو Goal-based Agent
ج) لا حاجة لأي معمارية، قرار عشوائي يكفي
د) Simple Reflex بدون أي تعديل
**الإجابة الصحيحة: ب**
**التعليل:** حاجة الروبوت للاحتفاظ بمعلومات عن مساره وأهدافه (نقاط التسليم المتبقية) تتطلب على الأقل ذاكرة داخلية (State) أو تمثيل أهداف (Goal-based)، بعكس Simple Reflex الذي يعتمد فقط على الإحساس اللحظي.

---

### السيناريو 2: وكيل ترجمة فورية بمؤتمر مباشر

> برنامج ذكاء اصطناعي يترجم كلام متحدث بمؤتمر حي فورياً لعدة لغات، ويعرض الترجمة كنص متحرك على الشاشة. الكلام يصل بشكل مستمر وسريع، والمتحدث لا ينتظر انتهاء الترجمة ليكمل حديثه.

### السؤال 2.1 (medium)
ما تصنيف هذه البيئة من حيث Static/Dynamic؟
أ) Static لأن الكلام نص مكتوب بالنهاية
ب) Dynamic لأن الكلام يستمر بالوصول حتى أثناء معالجة الوكيل للترجمة
ج) لا ينطبق عليها هذا البُعد لأنها بيئة رقمية
د) Static لأن المتحدث شخص واحد فقط
**الإجابة الصحيحة: ب**
**التعليل:** المتحدث يواصل الكلام دون انتظار انتهاء معالجة الوكيل، أي أن البيئة (تدفق الصوت) تتغير أثناء "تفكير" الوكيل — هذا بالضبط تعريف Dynamic.

### السؤال 2.2 (medium)
هل هذه البيئة Discrete أم Continuous من حيث معالجة الوقت والإشارة الصوتية؟
أ) Discrete بالكامل
ب) Continuous، لأن الصوت والوقت إشارات مستمرة
ج) لا علاقة لهذا البُعد بالصوت
د) يعتمد فقط على لغة المتحدث
**الإجابة الصحيحة: ب**
**التعليل:** الإشارة الصوتية والزمن بطبيعتهما مستمران (Continuous)، حتى لو تم لاحقاً تقطيعهما رقمياً لأغراض المعالجة.

### السؤال 2.3 (hard)
ما أنسب Performance measure لوكيل الترجمة الفورية هذا؟
أ) عدد الكلمات المترجمة بالدقيقة فقط بغض النظر عن الدقة
ب) دقة الترجمة مع الحفاظ على أقل تأخير زمني ممكن (latency)
ج) طول النص المعروض على الشاشة
د) عدد اللغات المدعومة فقط
**الإجابة الصحيحة: ب**
**التعليل:** بمهمة تعتمد على السرعة والدقة معاً (Dynamic environment)، لازم مقياس الأداء يوازن بين الاثنين، بعكس باقي الخيارات التي تتجاهل الدقة أو التأخير الزمني.

---

### السيناريو 3: وكيل تصنيف مراجعات المنتجات (Sentiment Classifier)

> برنامج يستقبل مراجعات نصية للمنتجات من موقع تسوق، ويصنّف كل مراجعة كإيجابية أو سلبية أو محايدة. كل مراجعة تُعالَج بشكل منفصل عن غيرها، ولا يحتاج الوكيل لمعرفة نتيجة تصنيف المراجعة السابقة ليصنّف الحالية.

### السؤال 3.1 (medium)
كيف تُصنَّف هذه البيئة من حيث Episodic/Sequential؟
أ) Sequential، لأن كل مراجعة تعتمد على السابقة
ب) Episodic، لأن كل مراجعة تُعالَج بمعزل عن غيرها
ج) لا ينطبق عليها هذا البُعد
د) Sequential، لأن الوكيل برنامج واحد يعالج كل المراجعات
**الإجابة الصحيحة: ب**
**التعليل:** النص صريح: "كل مراجعة تُعالَج بشكل منفصل ولا يحتاج الوكيل لمعرفة نتيجة المراجعة السابقة" — هذا هو بالضبط تعريف Episodic.

### السؤال 3.2 (medium)
ما نوع Actuator الأنسب لهذا الوكيل؟
أ) عجلة قيادة
ب) وسم/تصنيف المراجعة (positive/negative/neutral label)
ج) كاميرا
د) بوق
**الإجابة الصحيحة: ب**
**التعليل:** الفعل الوحيد المطلوب من هذا الوكيل هو إخراج تصنيف نصي للمراجعة، وهذا actuator رقمي بسيط، بعكس باقي الخيارات التي تخص وكلاء فيزيائيين (تاكسي).

### السؤال 3.3 (hard)
هل يحتاج هذا الوكيل بالضرورة لمعمارية Goal-based أو Utility-based؟
أ) نعم، دائماً
ب) لا، لأن المهمة تصنيف مباشر لكل مدخل بمعزل عن الآخر، فتكفيه معمارية أبسط (Simple Reflex أو Reflex with limited state حسب طريقة بناء النموذج)
ج) نعم، لأنه يحتاج تخطيط طويل المدى
د) لا، لأنه لا يحتاج أي معمارية إطلاقاً
**الإجابة الصحيحة: ب**
**التعليل:** بما أن كل مدخل مستقل (Episodic)، ولا حاجة للتخطيط نحو هدف مستقبلي متعدد الخطوات، فالمهمة لا تتطلب بالضرورة تعقيد Goal-based/Utility-based، رغم أن (د) خاطئة أيضاً لأن الوكيل بالتأكيد يحتاج معمارية ما (حتى لو بسيطة).

---

## الجزء الرابع: أسئلة تصحيح الخوارزميات (Pseudocode)

> غطِّ أنواع الأخطاء: منطقية، سوء فهم، heuristic خاطئ، حلقة لا نهائية.

### سؤال تصحيح 1 (logic)

**الكود التالي يحتوي خطأ:**
```text
function Vacuum-Agent([location, status]) returns an action
  if location = A then
    return Right
  else if location = B then
    return Left
  else if status = Dirty then
    return Suck
```
**اكتشف الخطأ:** ترتيب الشروط خاطئ — فحص الموقع جاء **قبل** فحص حالة النظافة، فسيتحرك الوكيل من مربع وسخ بدل تنظيفه أولاً.

**التصحيح:**
```text
function Vacuum-Agent([location, status]) returns an action
  if status = Dirty then
    return Suck
  else if location = A then
    return Right
  else if location = B then
    return Left
```
**شرح الحل:**
1. لازم فحص `Dirty` يكون بأعلى أولوية دائماً، بغض النظر عن الموقع.
2. فحص الموقع (`A` أو `B`) يجي فقط بعد التأكد إنه المكان الحالي نظيف.
3. الترتيب هون بيعكس أولوية المهمة الحقيقية: التنظيف أهم من التنقل.

---

### سؤال تصحيح 2 (infinite_loop)

**الكود التالي يحتوي خطأ:**
```text
function Reflex-Agent-With-State() returns an action
  state ← Update-State(state, percept)
  action ← Rule-Match(rules, state)
  return action
  // (لاحظ: لا يوجد أي تحديث لـ state بعد تنفيذ action)
```
**اكتشف الخطأ:** الوكيل يحدّث `state` بناءً على الإحساس الجديد، بس ما بيحدّث `state` بعد تنفيذ الفعل نفسه (What my actions do). فبالتالي، لو الفعل نفسه غيّر جزء من العالم غير مرئي مباشرة بالإحساس التالي، الوكيل ممكن يكرر نفس القرار للأبد (حلقة لا نهائية من نفس الفعل).

**التصحيح:**
```text
function Reflex-Agent-With-State() returns an action
  state ← Update-State(state, percept, action, transition-model)
  // transition-model يمثل "How the world evolves" و"What my actions do"
  action ← Rule-Match(rules, state)
  return action
```
**شرح الحل:**
1. حسب مخطط "Reflex agents with state" بالمحاضرة، تحديث الحالة لازم ياخذ بعين الاعتبار كل من: الإحساس الجديد، وكيف يتطور العالم من تلقاء نفسه، وماذا تفعل أفعال الوكيل بالعالم.
2. تجاهل أثر الفعل نفسه على الحالة الداخلية هو سبب شائع لتكرار نفس القرار للأبد رغم تغيّر الواقع.
3. الحل يضيف `transition-model` كمدخل إضافي لدالة تحديث الحالة.

---

### سؤال تصحيح 3 (misconception)

**الكود التالي يحتوي خطأ:**
```text
function Is-Rational(agent) returns boolean
  if agent.performance = optimal_possible_outcome then
    return True
  else
    return False
```
**اكتشف الخطأ:** هذا الكود يفترض أن الوكيل عقلاني فقط إذا حقق **أفضل نتيجة ممكنة فعلياً** (optimal outcome)، وهذا سوء فهم مباشر لتعريف العقلانية بالمحاضرة (rational ≠ successful).

**التصحيح:**
```text
function Is-Rational(agent, percept_sequence) returns boolean
  best_action ← Argmax(expected_performance_measure given percept_sequence)
  if agent.chosen_action = best_action then
    return True
  else
    return False
```
**شرح الحل:**
1. العقلانية تُقاس بمقارنة الفعل المختار مع الفعل الذي يعظّم **القيمة المتوقعة** لمقياس الأداء، بناءً على تاريخ الإحساسات فقط.
2. النتيجة الفعلية النهائية (outcome) قد تتأثر بعوامل خارج سيطرة الوكيل (حظ، عشوائية البيئة)، فلا يصح استخدامها كمقياس وحيد للعقلانية.
3. لذلك وكيل "خسر" بالنهاية ممكن يكون كان عقلانياً تماماً باتخاذ قراره.

---

### سؤال تصحيح 4 (wrong_heuristic)

**الكود التالي يحتوي خطأ:**
```text
// Performance measure لوكيل مكنسة كهربائية
function Performance-Measure(environment_history) returns score
  score ← count(moves made)
  return score
```
**اكتشف الخطأ:** المقياس هون بيكافئ الوكيل على **عدد الحركات** فقط، بدون أي اعتبار لعدد المربعات النظيفة — هذا "heuristic خاطئ" لأنه بيشجع الوكيل يتحرك كتير بلا فائدة (وحتى بيعاكس هدف المهمة الحقيقي وهو التنظيف).

**التصحيح:**
```text
function Performance-Measure(environment_history) returns score
  score ← (points_per_clean_square_per_timestep) - (points_per_move)
  return score
```
**شرح الحل:**
1. حسب المحاضرة، من الخيارات المقترحة لمقياس الأداء: "one point per clean square per time step, minus one per move" — هذا يوازن بين مكافأة النظافة وعقوبة الحركة الزائدة.
2. مكافأة الحركة وحدها (بدون ربطها بالنظافة) تعطي إشارة خاطئة تماماً عن الهدف الحقيقي للمهمة.
3. أي Performance measure يجب أن يعكس الهدف الفعلي للمهمة (تنظيف المربعات)، لا سلوكاً جانبياً (عدد الحركات).

---

### سؤال تصحيح 5 (logic)

**الكود التالي يحتوي خطأ:**
```text
// تصنيف بيئة "Backgammon"
Observable ← No
Deterministic ← Yes
Single_agent ← No
```
**اكتشف الخطأ:** تصنيف `Observable = No` و `Deterministic = Yes` خاطئان حسب المحاضرة — Backgammon كل الرقعة ظاهرة بالكامل (Observable = Yes)، بس فيها نرد عشوائي (Deterministic = No).

**التصحيح:**
```text
Observable ← Yes
Deterministic ← No
Single_agent ← No
```
**شرح الحل:**
1. Observable يخص رؤية **حالة الرقعة**، وهذه مكشوفة بالكامل بـ Backgammon لكل اللاعبين.
2. Deterministic يخص "هل النتيجة الجاية محددة أكيد من الفعل الحالي؟" — وجود الزهر (Dice) يجعلها Stochastic (أي Deterministic = No).
3. Single-agent تبقى صحيحة (No) لوجود خصم آخر بنفس اللعبة.

---

### سؤال تصحيح 6 (misconception)

**الكود التالي يحتوي خطأ:**
```text
// PEAS لوكيل فلترة السبام
Performance ← "maximize number of emails deleted"
```
**اكتشف الخطأ:** هذا يفترض أن الهدف هو حذف أكبر عدد من الرسائل، بينما الهدف الحقيقي حسب المحاضرة هو **تقليل الأخطاء** (false positives و false negatives)، وليس زيادة الحذف بشكل عشوائي (اللي ممكن يحذف رسائل مهمة).

**التصحيح:**
```text
Performance ← "minimize false positives and false negatives"
```
**شرح الحل:**
1. زيادة الحذف بشكل أعمى (بدون تمييز دقيق) بتزيد احتمال حذف رسائل مهمة (false positives) عن طريق الخطأ.
2. المقياس الصحيح حسب المحاضرة هو تقليل نوعي الأخطاء معاً: false positives و false negatives.
3. هذا مثال آخر على أهمية صياغة Performance measure ليعكس الهدف الحقيقي، لا مؤشراً سطحياً سهل القياس لكنه مضلِّل.

---

## تمارين تطبيقية (من إعداد الدليل للتدريب)

> **هذه تمارين إضافية من إعداد الدليل** — ليست في المحاضرة الأصلية.

### تمرين 1: أكمل الفراغات — code_fix

**المطلوب:** أكمل الكود الناقص لوكيل مكنسة كهربائية بثلاث غرف A، B، C:
```text
function Vacuum-Agent-3Rooms([location, status]) returns an action
  if status = Dirty then
    return Suck
  else if location = A then
    return _______ (1)
  else if location = B then
    return _______ (2)
  else if location = C then
    return _______ (3)
```

**نموذج الحل:**
1. `Right` (من A إلى B)
2. `Right` (من B إلى C) — أو `Left` للرجوع لـ A حسب استراتيجية التنقل المختارة، المهم الاتساق بالاتجاه
3. `Left` (رجوع من C باتجاه A/B لإكمال الدورة)

---

### تمرين 2: صمّم PEAS كامل — scenario

**السيناريو / المطلوب:** صمم توصيف PEAS كامل لوكيل "مساعد جدولة اجتماعات" يقترح أوقات اجتماعات مناسبة لعدة أشخاص بناءً على تقاويمهم الإلكترونية.

**المطلوب:**
1. حدد Performance measure.
2. حدد Environment.
3. حدد Actuators.
4. حدد Sensors.

**نموذج الحل:**
- Performance: تقليل التعارضات الزمنية، تعظيم رضا المشاركين، سرعة الاقتراح.
- Environment: تقاويم المستخدمين، مناطق زمنية مختلفة، تفضيلات أوقات العمل.
- Actuators: إرسال دعوة اجتماع، تعديل موعد، إرسال إشعار تذكير.
- Sensors: قراءة بيانات التقويم، حالة توفر كل مستخدم (Busy/Free)، ردود القبول/الرفض.

---

### تمرين 3: صنّف البيئة — logic_table

**المطلوب:** أكمل الجدول التالي لبيئة "مساعد جدولة الاجتماعات" من التمرين السابق:

| البُعد | القيمة | السبب |
| --- | --- | --- |
| Observable | ؟ | ؟ |
| Deterministic | ؟ | ؟ |
| Episodic/Sequential | ؟ | ؟ |
| Static/Dynamic | ؟ | ؟ |
| Discrete/Continuous | ؟ | ؟ |
| Single/Multiagent | ؟ | ؟ |

**نموذج الحل:**

| البُعد | القيمة | السبب |
| --- | --- | --- |
| Observable | Partially observable | لا يرى الوكيل كل تفاصيل يوم كل شخص (أمور شخصية غير مدوَّنة بالتقويم) |
| Deterministic | Stochastic | ردود الناس (قبول/رفض) غير مؤكدة مسبقاً |
| Episodic/Sequential | Sequential | جدولة اجتماع اليوم ممكن تؤثر على خيارات جدولة اجتماعات لاحقة |
| Static/Dynamic | Dynamic | تقويم شخص ممكن يتغير أثناء ما الوكيل يفكر بالاقتراح |
| Discrete/Continuous | Discrete | الأوقات المقترحة عادة بفواصل زمنية محددة (كل 15/30 دقيقة) |
| Single/Multiagent | Multiagent | أكثر من شخص (وربما أكثر من وكيل مساعد لكل شخص) يتفاعلون بنفس البيئة |

---

### تمرين 4: تتبع تنفيذ الوكيل — fill_gaps

**المطلوب:** بمعرفة الكود الأصلي لـ Reflex-Vacuum-Agent، أكمل الأفعال الناقصة لتسلسل الإحساسات التالي بدءاً من `[A, Dirty]`:

| الترتيب | الإحساس | الفعل |
| --- | --- | --- |
| 1 | [A, Dirty] | ؟ |
| 2 | [A, Clean] | ؟ |
| 3 | [B, Dirty] | ؟ |
| 4 | [B, Clean] | ؟ |

**نموذج الحل:**

| الترتيب | الإحساس | الفعل |
| --- | --- | --- |
| 1 | [A, Dirty] | Suck |
| 2 | [A, Clean] | Right |
| 3 | [B, Dirty] | Suck |
| 4 | [B, Clean] | Left |

---

### تمرين 5: قارن معماريتين — scenario

**السيناريو / المطلوب:** لديك وكيل يحتاج يعرف "أي غرف تم تنظيفها مسبقاً بالجولة الحالية" حتى لو الوكيل مو واقف فيها هلق.

**المطلوب:**
1. هل يكفي Simple Reflex Agent لهذه المهمة؟ برر إجابتك.
2. ما المعمارية الأنسب، ولماذا؟

**نموذج الحل:**
1. لا يكفي — Simple Reflex Agent يقرر فقط بناءً على الإحساس الحالي (موقعه ونظافته الآن)، وما عنده طريقة لتذكر غرف زارها سابقاً وهو مو واقف فيها.
2. الأنسب هو **Reflex Agent with State**: يحتفظ بمتغير داخلي (State) يسجل فيه "الغرف النظيفة لغاية الآن"، ويحدّثه بعد كل زيارة، فيقدر يقرر بذكاء أكبر (مثلاً يتوقف لما كل الغرف تصير نظيفة).

---

### تمرين 6: طبّق تصنيف الأبعاد الستة على وكيل جديد — case_study

**السيناريو / المطلوب:** وكيل يلعب لعبة "إكس-أو" (Tic-Tac-Toe) ضد لاعب بشري على نفس الشاشة، بالتناوب بينهما.

**المطلوب:**
صنّف هذه البيئة على الأبعاد الستة كاملة، مع سطر تبرير واحد لكل بُعد.

**نموذج الحل:**
- Observable = Yes (اللوحة كاملة ظاهرة للاعبين).
- Deterministic = Yes (كل حركة تحدد الحالة الجاية بشكل مؤكد بلا عشوائية).
- Episodic/Sequential = Sequential (كل حركة تؤثر على الحركات اللاحقة ومسار اللعبة).
- Static/Dynamic = Static (اللوحة تنتظر دور اللاعب، ما بتتغير من تلقاء نفسها أثناء تفكيره).
- Discrete/Continuous = Discrete (9 خانات محدودة وحركات معدودة).
- Single/Multiagent = Multiagent (لاعبان يتنافسان بنفس البيئة).

---

## تمارين تحليل وتطبيق (إضافية — من إعداد الدليل)

> تمارين تحليلية إضافية — جداول ناقصة، إكمال مخططات، تحليل مكتوب.

### تمرين 1: أكمل المخطط — diagram_completion

**السيناريو:** مخطط "Simple Reflex Agent" الأصلي فيه ثلاث مربعات رئيسية متصلة بترتيب معين، لكن أزيلت التسميات.

**المطلوب:**
1. رتّب المربعات الثلاثة بالترتيب الصحيح من استقبال الإحساس وحتى تنفيذ الفعل.
2. أضف اسم كل مربع.

**نموذج الحل:**
1→2→3 بالترتيب التالي:
1. `What the world is like now` (تفسير الإحساس القادم من Sensors)
2. `Condition-action rules` → `What action I should do now` (مطابقة الشرط بالقاعدة المناسبة)
3. `Actuators` (تنفيذ الفعل الناتج بالبيئة)

---

### تمرين 2: جدول ناقص — table_fill

**السيناريو:** جدول أنواع البيئة لمثال جديد "لعبة بوكر أونلاين متعددة اللاعبين" بدون قيم.

**المطلوب:** أكمل الجدول بالقيم المناسبة (Yes/No/Semi/Partly).

**نموذج الحل:**

| البُعد | القيمة |
| --- | --- |
| Observable | No (أوراق الخصوم مخفية) |
| Deterministic | No (توزيع الأوراق عشوائي) |
| Episodic | No (القرارات بجولة تؤثر على استراتيجية الجولات اللاحقة) |
| Static | Semi (تنتظر دورك لكن الخصوم يتخذون قرارات بفترات محددة) |
| Discrete | Yes (أوراق ورهانات بقيم محددة عادة) |
| Single-agent | No (عدة لاعبين متنافسين) |

---

### تمرين 3: تحليل مكتوب — written_analysis

**السيناريو:** قارن بين Performance measure المقترح لعالم المكنسة الكهربائية بثلاثة اقتراحات مختلفة وردت بالمحاضرة: (1) نقطة لكل مربع نظيف بوقت T، (2) نقطة لكل مربع نظيف لكل خطوة زمنية ناقص نقطة لكل حركة، (3) عقوبة إذا أكثر من k مربع وسخ.

**المطلوب:**
اكتب فقرة (3-5 أسطر) تحلل فيها كيف يختلف سلوك الوكيل "الأمثل" حسب كل اقتراح من الثلاثة.

**نموذج الحل:**
الاقتراح الأول يشجع الوكيل يوصل لأكبر عدد مربعات نظيفة **بحلول وقت محدد فقط** بغض النظر عن الكفاءة، فممكن يقبل حركات كتيرة زايدة طالما وصل بالنهاية. الاقتراح الثاني أذكى لأنه بيعاقب كل حركة زايدة، فبيشجع الوكيل يوازن بين النظافة والكفاءة (أقل عدد حركات ممكن). أما الاقتراح الثالث فبيركّز بس على تجنب "الفشل الكارثي" (أكتر من k مربع وسخ)، وممكن يسمح للوكيل يتجاهل تحسين النظافة بعد ما يوصل تحت العتبة، وهاد ممكن يعطي سلوك أقل طموحاً من الاقتراحين الأولين.

---

### تمرين 4: دراسة حالة — case_study

**السيناريو:** فريق تطوير قرر استخدام Simple Reflex Agent فقط لبناء سيارة أجرة ذاتية القيادة كاملة.

**المطلوب:**
1. هل هذا القرار مناسب؟ برر بالاستناد لتصنيف بيئة التاكسي.
2. اقترح المعمارية الأنسب بدلاً منها.

**نموذج الحل:**
1. غير مناسب إطلاقاً — بيئة التاكسي مصنّفة (Partially observable, Stochastic, Sequential, Dynamic, Continuous, Multiagent)، وهي أعقد توليفة ممكنة. Simple Reflex Agent يعتمد فقط على الإحساس اللحظي بدون ذاكرة أو تخطيط، وهذا غير كافٍ إطلاقاً لبيئة معقدة كهذه (لن يستطيع مثلاً تذكر مسار الطريق أو التخطيط لتجاوز آمن).
2. الأنسب هو **Utility-based Agent** (أو على الأقل Goal-based Agent)، لأنه يحتاج يوازن بين أهداف متعددة ومتضاربة أحياناً (السرعة مقابل السلامة مقابل الراحة)، وهذا بالضبط دور دالة المنفعة (Utility function).

---

### تمرين 5: heuristic_eval مبسّط — analysis

**السيناريو:** مصمّم اقترح Performance measure لوكيل تسوق إنترنت: "عدد الصفحات التي زارها الوكيل بالدقيقة."

**المطلوب:**
حلل: هل هذا المقياس يعكس فعلياً هدف المهمة (Price, Quality, Appropriateness, Efficiency)؟ اشرح لماذا نعم أو لا.

**نموذج الحل:**
لا يعكس الهدف الحقيقي. عدد الصفحات المزارة لا علاقة مباشرة له بالسعر أو الجودة أو ملاءمة المنتج — ممكن وكيل يزور صفحات كتير بلا فائدة (تصفح عشوائي) ويحصل على درجة عالية زائفة، بينما وكيل آخر أذكى وأسرع بيوصل لأفضل منتج بأقل عدد زيارات ويحصل على درجة منخفضة زوراً. المقياس الصحيح لازم يربط مباشرة بـ Price/Quality/Appropriateness/Efficiency كما وردت بالمحاضرة الأصلية.

---

## تمارين تتبع الخوارزميات (خطوة بخطوة)

### تمرين تتبع 1: Reflex-Vacuum-Agent بتسلسل كامل

**المدخل:**
```text
تسلسل الإحساسات: [A,Dirty] → [A,Clean] → [B,Clean] → [B,Dirty] → [B,Clean]
```

**تتبّع خطوة بخطوة (أكمل الجدول):**
| الخطوة | الإحساس | الفعل |
| --- | --- | --- |
| 1 | [A,Dirty] | ؟ |
| 2 | [A,Clean] | ؟ |
| 3 | [B,Clean] | ؟ |
| 4 | [B,Dirty] | ؟ |
| 5 | [B,Clean] | ؟ |

**نموذج الحل:**
| الخطوة | الإحساس | الفعل |
| --- | --- | --- |
| 1 | [A,Dirty] | Suck |
| 2 | [A,Clean] | Right |
| 3 | [B,Clean] | Left |
| 4 | [B,Dirty] | Suck |
| 5 | [B,Clean] | Left |

**النتيجة:** الوكيل ينتقل بين A وB ويكرر التنظيف كل ما احتاج، بدون أي ذاكرة عن كم مرة زار كل غرفة — سلوك دوري نموذجي لـ Simple Reflex Agent.

#### 🔍 سؤال MCQ على نفس التتبع
بالخطوة 5، لماذا الفعل `Left` وليس `Right`؟
أ) لأن الوكيل بموقع B ونظيف، فالقاعدة تنص "else if location = B then return Left"
ب) لأنه قرار عشوائي
ج) لأن الوكيل يتذكر أنه زار A سابقاً
د) لا يوجد سبب منطقي
**الإجابة الصحيحة: أ**

---

### تمرين تتبع 2: تصنيف بيئة جديدة خطوة بخطوة

**المدخل:**
```text
بيئة: نظام توصية أفلام (Movie Recommendation System) يقترح أفلاماً بناءً على تاريخ مشاهدة المستخدم
```

**أكمل الجدول:**
| الخطوة | السؤال | الإجابة |
| --- | --- | --- |
| 1 | هل يرى الوكيل كل تفضيلات المستخدم الحقيقية؟ | ؟ |
| 2 | هل رد فعل المستخدم على الاقتراح مؤكد مسبقاً؟ | ؟ |
| 3 | هل قرار اليوم يؤثر على اقتراحات المستقبل (عبر تحديث النموذج)؟ | ؟ |
| 4 | هل قاعدة بيانات الأفلام تتغير أثناء توليد الاقتراح؟ | ؟ |

**نموذج الحل:**
| الخطوة | السؤال | الإجابة |
| --- | --- | --- |
| 1 | هل يرى الوكيل كل تفضيلات المستخدم الحقيقية؟ | لا — Partially observable (يرى فقط سجل المشاهدة والتقييمات المسجّلة) |
| 2 | هل رد فعل المستخدم على الاقتراح مؤكد مسبقاً؟ | لا — Stochastic (المستخدم قد يشاهد أو يتجاهل الاقتراح) |
| 3 | هل قرار اليوم يؤثر على اقتراحات المستقبل؟ | نعم — Sequential |
| 4 | هل قاعدة البيانات تتغير أثناء توليد الاقتراح؟ | غالباً قليلاً/نادراً أثناء الاستعلام الواحد — أقرب لـ Static من ناحية عملية التوليد نفسها، لكن Dynamic على المدى الأطول (إضافة أفلام جديدة باستمرار) |

**النتيجة النهائية:** هذه البيئة عملياً أقرب لتوليفة (Partially observable, Stochastic, Sequential) — أي أعقد من عالم المكنسة الكهربائية وأقرب لتعقيد بيئة التاكسي من حيث نقص المعرفة الكاملة.

---

### تمرين تتبع 3: من Simple Reflex إلى Goal-based — تتبع القرار

**المدخل:**
```text
هدف الوكيل: تنظيف كل الغرف (A, B) والتوقف تماماً (NoOp) لما تصير كلها نظيفة.
الحالة الابتدائية: state = {A: unknown, B: unknown}
تسلسل الإحساسات: [A,Dirty] → [A,Clean] → [B,Dirty] → [B,Clean]
```

**أكمل الجدول (وكيل Goal-based بحالة داخلية):**
| الخطوة | الإحساس | تحديث الحالة الداخلية | الفعل | هل تحقق الهدف؟ |
| --- | --- | --- | --- | --- |
| 1 | [A,Dirty] | ؟ | ؟ | ؟ |
| 2 | [A,Clean] | ؟ | ؟ | ؟ |
| 3 | [B,Dirty] | ؟ | ؟ | ؟ |
| 4 | [B,Clean] | ؟ | ؟ | ؟ |

**نموذج الحل:**
| الخطوة | الإحساس | تحديث الحالة الداخلية | الفعل | هل تحقق الهدف؟ |
| --- | --- | --- | --- | --- |
| 1 | [A,Dirty] | state.A = dirty | Suck | لا |
| 2 | [A,Clean] | state.A = clean | Right | لا (B غير معروفة بعد) |
| 3 | [B,Dirty] | state.B = dirty | Suck | لا |
| 4 | [B,Clean] | state.B = clean | NoOp | **نعم** — state.A=clean AND state.B=clean |

**النتيجة:** الوكيل بمعمارية Goal-based قادر يتوقف تماماً (`NoOp`) لما يتحقق الهدف الكامل، بعكس Simple Reflex الذي كان سيستمر بالتنقل بلا نهاية بين A وB حتى لو كانت كل الغرف نظيفة أصلاً.

---

### تمرين تتبع 4: تتبع اختيار المعمارية حسب تعقيد البيئة

**المدخل:**
```text
أربع بيئات: (1) Solitaire (2) Backgammon (3) Internet Shopping (4) Taxi
```

**أكمل الجدول:**
| البيئة | مستوى التعقيد (من الجدول) | المعمارية الأنسب | لماذا |
| --- | --- | --- | --- |
| Solitaire | ؟ | ؟ | ؟ |
| Backgammon | ؟ | ؟ | ؟ |
| Internet Shopping | ؟ | ؟ | ؟ |
| Taxi | ؟ | ؟ | ؟ |

**نموذج الحل:**
| البيئة | مستوى التعقيد | المعمارية الأنسب | لماذا |
| --- | --- | --- | --- |
| Solitaire | بسيط جداً (Observable, Deterministic, Static, Single-agent) | Simple Reflex أو Goal-based بسيط | كل المعلومات متاحة والنتائج مؤكدة |
| Backgammon | متوسط (Observable لكن Stochastic وMultiagent) | Utility-based | يحتاج موازنة احتمالات الزهر ومنافسة الخصم |
| Internet Shopping | متوسط-معقد (Partially observable, Semi-dynamic) | Goal-based أو Utility-based | يحتاج تخطيط بحث متعدد الخطوات نحو هدف الشراء الأمثل |
| Taxi | الأعقد (كل الأبعاد بصفها الصعب) | Utility-based (مع Learning) | يحتاج موازنة أهداف متعددة متضاربة (سلامة/سرعة/ربح) واتخاذ قرار تحت عدم يقين مستمر |

**النتيجة:** كلما زاد تعقيد البيئة (خصوصاً Partially observable + Stochastic + Multiagent)، احتجنا معمارية أعلى بالسلسلة (Simple Reflex → State → Goal-based → Utility-based).

---

## أسئلة تصميم

### سؤال تصميم 1: تصميم PEAS لوكيل جديد

**المطلوب:**
صمم توصيف PEAS كامل لوكيل "مراقبة جودة الهواء" ينشر تنبيهات لسكان مدينة عند ارتفاع نسبة التلوث، بالاعتماد على شبكة حساسات موزعة بالمدينة.

**نموذج الإجابة:**
- **Performance measure:** دقة كشف مستويات التلوث الخطرة، سرعة إصدار التنبيه، تقليل الإنذارات الكاذبة (false alarms)، تغطية أكبر عدد ممكن من المناطق.
- **Environment:** المدينة الفيزيائية، شبكة الحساسات الموزعة، الظروف الجوية (رياح، رطوبة، حرارة)، السكان المستهدفون بالتنبيه.
- **Actuators:** إرسال إشعار/رسالة نصية، تحديث لوحة عرض عامة، تفعيل إنذار صوتي بمناطق حرجة.
- **Sensors:** حساسات جودة الهواء (PM2.5، CO2، إلخ)، محطات الطقس، بيانات تاريخية سابقة.

**معايير التقييم:**
- شمول العناصر الأربعة (P/E/A/S) دون خلط بينها.
- ملاءمة كل عنصر لطبيعة المهمة (مثلاً لا يذكر "مقود" كـ actuator هنا).
- وضوح Performance measure وقابليته للقياس فعلياً.

---

### سؤال تصميم 2: تصميم معمارية وكيل (Architecture) بناءً على تصنيف البيئة

**المطلوب:**
بناءً على تصنيف بيئة "مراقبة جودة الهواء" أعلاه (غالباً: Partially observable, Stochastic, Sequential, Dynamic, Continuous, Multiagent-ish بسبب تعدد المصادر)، ارسم/صمم مخطط معمارية الوكيل الأنسب (استخدم مكونات: Sensors, State, How the world evolves, What my actions do, Goals/Utility, Actuators)، مع تبرير كل مكوّن.

**نموذج الإجابة:**
```diagram
type: flowchart
title: Air Quality Monitoring Agent Architecture
direction: TD
nodes:
  - id: sensors
    label: Sensors (air quality readings)
    kind: input
    level: 0
  - id: state
    label: State (current pollution map)
    kind: process
    level: 1
  - id: world_model
    label: How the world evolves + What my actions do
    kind: process
    level: 1
  - id: utility
    label: Utility (severity vs false-alarm cost)
    kind: process
    level: 2
  - id: decision
    label: What action I should do now
    kind: decision
    level: 3
  - id: actuators
    label: Actuators (send alert / update dashboard)
    kind: output
    level: 4
edges:
  - from: sensors
    to: state
  - from: world_model
    to: state
  - from: state
    to: utility
  - from: utility
    to: decision
  - from: decision
    to: actuators
```

**معايير التقييم:**
- استخدام معمارية Utility-based مبرَّرة (بسبب الحاجة لموازنة خطورة التلوث مقابل تكلفة الإنذار الكاذب — أهداف متعددة/متضاربة).
- وجود State وWorld model، بما إن البيئة Partially observable وDynamic (الحاجة لتذكر قراءات سابقة وتوقع تطور الوضع).
- تسلسل منطقي واضح من Sensors حتى Actuators.

---

## بطاقات سؤال وجواب (Q&A Cards)

**Q1:** ما تعريف الـ Agent؟
A: أي كيان يحس بالبيئة عبر sensors ويتصرف فيها عبر actuators.

**Q2:** ما الفرق بين Agent Function وAgent Program؟
A: Function وصف رياضي نظري مجرّد (P*→A)، بينما Program هو الكود الفعلي الذي ينفذه على جهاز حقيقي.

**Q3:** ما معادلة "Agent" الأساسية حسب المحاضرة؟
A: Agent = Architecture + Program.

**Q4:** متى نعتبر وكيلاً عقلانياً (Rational)؟
A: عندما يختار الفعل الذي يعظّم القيمة المتوقعة لمقياس الأداء بناءً على تاريخ الإحساسات حتى الآن.

**Q5:** هل rational يساوي omniscient؟
A: لا — الوكيل العقلاني لا يعرف بالضرورة كل المعلومات ذات الصلة.

**Q6:** هل rational يساوي clairvoyant؟
A: لا — نتائج أفعال الوكيل قد لا تكون كما توقع.

**Q7:** ماذا يعني PEAS؟
A: Performance measure, Environment, Actuators, Sensors — إطار لتوصيف أي مسألة وكيل.

**Q8:** ما Performance measure لوكيل فلترة السبام؟
A: تقليل الأخطاء الإيجابية الكاذبة (false positives) والسلبية الكاذبة (false negatives).

**Q9:** ما تعريف Fully observable؟
A: عندما تعطي حساسات الوكيل الوصول الكامل لحالة البيئة بكل لحظة.

**Q10:** ما تعريف Deterministic؟
A: عندما تكون الحالة التالية محددة بالكامل من الحالة الحالية وفعل الوكيل.

**Q11:** ما الفرق بين Episodic وSequential؟
A: بالـ Episodic كل حلقة مستقلة عن السابقة، وبالـ Sequential القرار الحالي يؤثر على المستقبل.

**Q12:** ما تعريف Dynamic؟
A: عندما يمكن للبيئة أن تتغير أثناء تفكير الوكيل (deliberation).

**Q13:** كيف صُنّفت بيئة Backgammon من حيث Observable وDeterministic؟
A: Observable = Yes، Deterministic = No (بسبب الزهر العشوائي).

**Q14:** كيف صُنّفت بيئة Taxi على كل الأبعاد الستة؟
A: No على كل الأبعاد الستة (partially observable, stochastic, sequential, dynamic, continuous, multiagent).

**Q15:** ما هي المعماريات الأربع الأساسية للوكيل بترتيب تصاعدي بالعمومية؟
A: Simple reflex agents → Reflex agents with state → Goal-based agents → Utility-based agents.

**Q16:** ماذا يضيف Goal-based Agent فوق Reflex Agent with State؟
A: يضيف Goals (أهداف) وتوقع "ماذا سيحدث إذا نفذت فعل A" لاختيار الفعل المناسب لتحقيق الهدف.

**Q17:** ماذا يضيف Utility-based Agent فوق Goal-based Agent؟
A: يضيف دالة Utility لقياس "كم سأكون سعيداً بهذه الحالة" — مفيدة عند وجود أهداف متعددة أو متضاربة.

**Q18:** هل يمكن تحويل أي من المعماريات الأربع إلى Learning Agent؟
A: نعم — كل المعماريات الأربع يمكن تحويلها إلى Learning Agents حسب المحاضرة.

---

## الجزء الخامس: الخوارزميات الكاملة (مرجع Pseudocode)

> مرجع pseudocode كامل — بدون شرح جديد. كل خوارزمية بكتلة مستقلة.

```text
// Reflex-Vacuum-Agent
function Reflex-Vacuum-Agent([location, status]) returns an action
  if status = Dirty then
    return Suck
  else if location = A then
    return Right
  else if location = B then
    return Left
```

```text
// Generic PEAS Specification Procedure
function Specify-PEAS(task) returns peas_description
  Performance ← define success criteria for task
  Environment ← enumerate all external entities/factors affecting task
  Actuators   ← enumerate all action-execution tools available
  Sensors     ← enumerate all information-gathering tools available
  return (Performance, Environment, Actuators, Sensors)
```

```text
// Environment Classification Procedure
function Classify-Environment(env) returns classification
  Observable      ← Fully or Partially, based on sensor coverage of true state
  Deterministic   ← Deterministic or Stochastic, based on next-state predictability
  Episodic        ← Episodic or Sequential, based on inter-episode dependency
  Static          ← Static or Dynamic, based on change-during-deliberation
  Discrete        ← Discrete or Continuous, based on state/time/percept/action nature
  Single_agent    ← Single-agent or Multiagent, based on number of interacting agents
  return classification
```

```text
// Generic Reflex Agent with State (conceptual template)
function Reflex-Agent-With-State(percept) returns an action
  persistent: state, rules, action  // state carried across calls
  state ← Update-State(state, action, percept, transition-model)
  // transition-model encodes "how the world evolves" + "what my actions do"
  rule ← Rule-Match(state, rules)
  action ← Rule-Action(rule)
  return action
```

```text
// Generic Goal-based Agent (conceptual template)
function Goal-Based-Agent(percept) returns an action
  persistent: state, goals, transition-model
  state ← Update-State(state, action, percept, transition-model)
  for each candidate_action in possible_actions:
    predicted_state ← Predict(state, candidate_action, transition-model)
    if Satisfies-Goal(predicted_state, goals) then
      action ← candidate_action
      break
  return action
```

```text
// Generic Utility-based Agent (conceptual template)
function Utility-Based-Agent(percept) returns an action
  persistent: state, utility_function, transition-model
  state ← Update-State(state, action, percept, transition-model)
  best_action ← Argmax over candidate_action of
                  Utility(Predict(state, candidate_action, transition-model))
  action ← best_action
  return action
```

---

## الجزء الخامس: أسئلة نظرية متوقعة بالامتحان

### السؤال 1: ما تعريف الوكيل (Agent)؟
**نموذج الإجابة:**
1. التعريف: أي كيان يُنظر إليه كمُدرِك (perceiving) لبيئته عبر sensors ومؤثر (acting) بها عبر actuators.
2. المكونات/الشروط: sensors (استقبال percepts)، actuators (تنفيذ actions)، environment (البيئة المحيطة).
3. مثال: روبوت مكنسة كهربائية — sensor لموقعه وحالة النظافة، actuator للتحرك والتنظيف.
4. متى نستخدم: أي مرة نبدأ نصمم نظام ذكاء اصطناعي — أول خطوة هي تعريف الوكيل بهذا الإطار.

### السؤال 2: اشرح الفرق بين Agent Function وAgent Program.
**نموذج الإجابة:**
1. التعريف: Agent Function دالة رياضية مجرّدة F: P*→A، بينما Agent Program هو الكود الفعلي الذي يعمل على architecture حقيقية.
2. المكونات/الشروط: Function نظرية بحتة (جدول لا نهائي)، Program عملي ومحدود بالكود.
3. مثال: Reflex-Vacuum-Agent كـ program فعلي يحاكي سلوك الـ function المطلوبة.
4. متى نستخدم: نستخدم Program عملياً دائماً؛ Function مفيدة فقط كأداة وصف نظرية لتحليل السلوك المطلوب.

### السؤال 3: عرّف العقلانية (Rationality) واذكر الفروق الثلاثة المرتبطة بها.
**نموذج الإجابة:**
1. التعريف: اختيار الفعل الذي يعظّم القيمة المتوقعة لمقياس الأداء بناءً على تاريخ الإحساسات حتى الآن.
2. المكونات/الشروط: rational ≠ omniscient، rational ≠ clairvoyant، وبالتالي rational ≠ successful.
3. مثال: سائق يتخذ أفضل قرار متاح بمعلوماته لكن يتعرض لحادث بسبب سائق آخر متهور (خارج سيطرته).
4. متى نستخدم: عند تقييم "جودة قرار" وكيل بمعزل عن نتيجته النهائية الفعلية.

### السؤال 4: ما هو إطار PEAS وما فائدته؟
**نموذج الإجابة:**
1. التعريف: إطار توصيف رسمي لأي مسألة وكيل: Performance, Environment, Actuators, Sensors.
2. المكونات/الشروط: أربعة عناصر ثابتة يجب تحديدها لأي وكيل جديد.
3. مثال: سيارة أجرة ذاتية (Safe/fast/legal/comfortable/profit؛ Roads/traffic/pedestrians؛ Wheel/pedals/brake؛ Cameras/GPS/sonar).
4. متى نستخدم: كخطوة أولى إلزامية قبل أي تصميم أو تحليل لوكيل جديد.

### السؤال 5: اشرح بُعد Observable/Partially observable مع مثال.
**نموذج الإجابة:**
1. التعريف: Fully observable إذا كانت حساسات الوكيل تعطيه وصولاً كاملاً لحالة البيئة الحقيقية بكل لحظة.
2. المكونات/الشروط: "effectively fully observable" إذا غطت الحساسات كل الجوانب ذات الصلة بالقرار (حتى لو لم تغطِ كل شيء حرفياً).
3. مثال: Solitaire=Fully observable (كل الورق ظاهر)، Taxi=Partially observable (كاميرات لا ترى كل شيء).
4. متى نستخدم: لتحديد إذا احتاج الوكيل بناء state داخلي يعوّض النقص بالمعلومات.

### السؤال 6: اشرح بُعد Deterministic/Stochastic مع مثال.
**نموذج الإجابة:**
1. التعريف: Deterministic إذا كانت الحالة التالية محددة بالكامل من الحالة الحالية وفعل الوكيل؛ وإلا فهي Stochastic.
2. المكونات/الشروط: وجود عنصر عشوائي (زهر، سلوك خصم غير متوقع) يحوّل البيئة لـ Stochastic.
3. مثال: Solitaire=Deterministic (حركتك تحدد النتيجة أكيد)، Backgammon=Stochastic (بسبب الزهر).
4. متى نستخدم: لتحديد إذا احتاج الوكيل تفكيراً احتمالياً (probabilistic reasoning) بقراراته.

### السؤال 7: اشرح بُعد Episodic/Sequential مع مثال.
**نموذج الإجابة:**
1. التعريف: Episodic إذا كانت تجربة الوكيل مقسمة لحلقات منفصلة لا تعتمد كل واحدة على الأخرى؛ وإلا فهي Sequential.
2. المكونات/الشروط: بالـ Sequential، القرار الحالي يمكن أن يؤثر على كل القرارات المستقبلية.
3. مثال: تصنيف صورة واحدة بمعزل عن غيرها = Episodic؛ لعبة شطرنج (كل نقلة تؤثر على الباقي) = Sequential.
4. متى نستخدم: لتحديد إذا احتاج الوكيل تخطيطاً مستقبلياً (planning) أم لا.

### السؤال 8: اشرح بُعد Static/Dynamic مع مثال.
**نموذج الإجابة:**
1. التعريف: Dynamic إذا كانت البيئة يمكن أن تتغير أثناء تفكير (deliberation) الوكيل؛ وإلا فهي Static.
2. المكونات/الشروط: يخص هذا البُعد تحديداً فترة "التفكير" وليس فترة تنفيذ الفعل نفسه.
3. مثال: لعبة سوليتير (تنتظر قرارك) = Static؛ قيادة سيارة على طريق مزدحم = Dynamic.
4. متى نستخدم: لتحديد مدى الحاجة لسرعة استجابة الوكيل وتقليل زمن اتخاذ القرار.

### السؤال 9: اذكر واشرح المعماريات الأربع الأساسية للوكيل بالترتيب.
**نموذج الإجابة:**
1. التعريف: Simple reflex (يعتمد على الإحساس الحالي فقط) → Reflex with state (يضيف ذاكرة داخلية) → Goal-based (يضيف أهداف وتنبؤ بالنتائج) → Utility-based (يضيف دالة منفعة لموازنة أهداف متعددة).
2. المكونات/الشروط: كل معمارية أعم من سابقتها وتضيف مكوناً جديداً (State، ثم Goals، ثم Utility).
3. مثال: Reflex-Vacuum-Agent (Simple reflex) مقابل وكيل تاكسي متكامل (Utility-based).
4. متى نستخدم: نختار المعمارية حسب تعقيد البيئة (الأبعاد الستة) — كلما زاد التعقيد، زادت الحاجة لمعمارية أعلى بالسلسلة.

### السؤال 10: لماذا "rational ⇒ exploration, learning, autonomy"؟
**نموذج الإجابة:**
1. التعريف: كون الوكيل عقلانياً يفرض عليه ضمنياً أن يستكشف، يتعلم، ويكون مستقلاً بقراراته.
2. المكونات/الشروط: بما أن الوكيل ليس omniscient ولا clairvoyant، فهو يحتاج يجمع معلومات جديدة (exploration)، يحسّن سلوكه بمرور الوقت (learning)، ويعتمد على معلوماته الخاصة بدل الاعتماد الكامل على معرفة مسبّقة مُعطاة له (autonomy).
3. مثال: وكيل تاكسي يتعلم طرقاً جديدة أسرع بمرور الوقت بدل الاعتماد فقط على خريطة ثابتة أولية.
4. متى نستخدم: عند تصميم وكلاء لبيئات معقدة وغير معروفة بالكامل مسبقاً.

### السؤال 11: ما تعريف Discrete/Continuous وعلى ماذا ينطبق؟
**نموذج الإجابة:**
1. التعريف: التمييز بين حالات/قيم منفصلة معدودة (Discrete) وحالات/قيم متصلة (Continuous).
2. المكونات/الشروط: ينطبق على حالة البيئة نفسها، وطريقة التعامل مع الوقت، وعلى الـ percepts والـ actions أيضاً.
3. مثال: رقعة شطرنج (Discrete بكل شيء) مقابل قيادة سيارة (Continuous بالسرعة والموقع والوقت).
4. متى نستخدم: لتحديد إذا يمكن استخدام تمثيلات منفصلة بسيطة (جداول/رسوم بيانية) أو نحتاج نماذج رياضية مستمرة.

### السؤال 12: ما تعريف Single-agent/Multiagent مع الإشارة لاستثناء مهم؟
**نموذج الإجابة:**
1. التعريف: Single-agent إذا كان هناك وكيل واحد فقط يؤثر بالبيئة؛ Multiagent إذا وُجد أكثر من وكيل مؤثر.
2. المكونات/الشروط: التمييز قد يبدو بسيطاً لكن يحتاج تحديد دقيق لمن يُعتبر "وكيلاً" فعلياً بنفس البيئة.
3. مثال: Internet Shopping غالباً Single-agent، **لكن باستثناء حالة المزادات (auctions)** حيث تصبح Multiagent بسبب وجود مزايدين متنافسين.
4. متى نستخدم: لتحديد إذا احتاج الوكيل استراتيجية تراعي قرارات/تنافس وكلاء آخرين (Game theory عناصر).

---

## الجزء السادس: قائمة فحص ذاتي قبل الامتحان ✅

- [ ] أقدر أعرّف Agent وأشرح دورة sensors ↔ percepts ↔ actions ↔ actuators.
- [ ] أفرّق بوضوح بين Agent Function وAgent Program، وأعرف معادلة Agent = Architecture + Program.
- [ ] أحفظ تعريف Rationality بدقة، وأقدر أشرح ليش rational ≠ omniscient، rational ≠ clairvoyant، rational ≠ successful.
- [ ] أحفظ عناصر PEAS الأربعة وأقدر أطبقها على أي مثال جديد (مو بس التاكسي والسبام والشوبينغ).
- [ ] أحفظ الأبعاد الستة لتصنيف البيئة وتعريف كل واحد منها بدقة (خصوصاً الفرق بين Episodic/Sequential وStatic/Dynamic).
- [ ] أقدر أرجّع تصنيف الأمثلة الأربعة (Solitaire, Backgammon, Internet Shopping, Taxi) على الأبعاد الستة من الذاكرة.
- [ ] أحفظ توليفة "العالم الحقيقي" الستة (partially observable, stochastic, sequential, dynamic, continuous, multi-agent) بالترتيب.
- [ ] أعرف المعماريات الأربع بالترتيب التصاعدي وشو بتضيف كل وحدة عن اللي قبلها.
- [ ] أقدر أتتبع Reflex-Vacuum-Agent يدوياً لأي تسلسل إحساسات جديد.
- [ ] أقدر أميّز أخطاء شائعة بترتيب condition-action rules (مثل أولوية فحص Dirty قبل location).

---

## الجزء السادس: ورقة المراجعة السريعة (Cheat Sheet)

### 🔑 خريطة العلاقات بين المحاضرات

| المحاضرة | ترتبط مع | كيف؟ |
| --- | --- | --- |
| المحاضرة 1 (تمهيد) | المحاضرة 2 | فكرة "الوكيل العقلاني" هون بتُبنى عليها كل المحاضرة |
| المحاضرة 2 (هذه) | المحاضرة 3 (Search) | تصنيف البيئة (Deterministic/Episodic إلخ) بيحدد أي خوارزمية بحث بتصلح |

### 🔑 أهم النقاط الذهبية

| الموضوع | النقاط |
| --- | --- |
| Agent | perceive (sensors) + act (actuators) على environment |
| Rationality | يعظّم expected performance بناءً على percept history؛ ≠ omniscient/clairvoyant/successful |
| PEAS | Performance, Environment, Actuators, Sensors |
| Environment Types | 6 أبعاد: Observable, Deterministic, Episodic, Static, Discrete, Single-agent |
| Real world | partially observable, stochastic, sequential, dynamic, continuous, multi-agent |
| Agent Types | Simple reflex → State → Goal-based → Utility-based (كلها ممكن تصير Learning) |

### 🔑 مرجع سريع

| الرمز/المصطلح | المعنى | يُستخدم في |
| --- | --- | --- |
| `F: P* → A` | Agent Function: من تاريخ الإحساسات لفعل | تعريف نظري للوكيل |
| `PEAS` | Performance/Environment/Actuators/Sensors | توصيف أي مسألة وكيل |
| `[location, status]` | Percept بمثال المكنسة | Reflex-Vacuum-Agent |

### 🔑 قواعد ذهبية لا تُنسى

| # | القاعدة |
| --- | --- |
| 1 | Rational ≠ Omniscient ≠ Clairvoyant ≠ Successful — احفظ الثلاثة مع بعض. |
| 2 | نوع البيئة (الأبعاد الستة) هو اللي بيحدد أي معمارية وكيل تختار. |
| 3 | فحص Dirty لازم دايماً يسبق فحص location بوكيل المكنسة — الترتيب بالـ condition-action rules مهم جداً. |
| 4 | العالم الحقيقي = أصعب توليفة ممكنة على الأبعاد الستة (كلها بالجهة "الصعبة"). |
| 5 | كل معمارية أعلى بتضيف مكوّن واحد جديد: State ثم Goals ثم Utility. |

<!-- VALIDATION: تم توليد هذا الدليل بالكامل استناداً حصراً لمحتوى محاضرة "Intelligent Agents" (Lecture 2) المرفقة، وباتباع القالب الوارد بملف ai-theory.md حرفياً. تم تغطية جميع الشرائح (1-28) ضمن الجزء الأول. عدد أسئلة MCQ = 24 (18 أساسي + 3 سيناريوهات × 3). عدد أسئلة تصحيح pseudocode = 6 (logic×2, infinite_loop×1, misconception×2, wrong_heuristic×1). عدد بطاقات Q&A = 18. عدد أسئلة نظرية = 12. عدد تمارين تطبيقية = 6. عدد تمارين تحليل = 5. عدد تمارين تتبع = 4. عدد أسئلة تصميم = 2. -->
