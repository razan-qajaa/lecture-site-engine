# المحاضرة 10 — Introduction to Machine Learning (مقدمة في تعلم الآلة)

> **المادة:** الذكاء الاصطناعي (القسم النظري) | **الموضوع:** تعلم الآلة — التعريف، الأنواع، التصميم، التطبيقات | **المحاضر:** Dr. Yosser ATASSI

---

## 📌 خريطة التكامل (أين تقع هذه المحاضرة في الدورة؟)

| المرحلة | الموضوع | الأدوات الرئيسية | المخرجات |
|---|---|---|---|
| 1 | Introduction to AI | `Rational Agent`، `Turing Test`، `PEAS` | فهم ما هو الذكاء الاصطناعي |
| 2 | Problem Solving & Search | `BFS`، `DFS`، `A*`، `Minimax` | حل المسائل بالبحث |
| 3 | Logical Agents | `Propositional Logic`، `FOL`، `Resolution` | الاستدلال المنطقي |
| 4 | **← أنت هنا** — Machine Learning | `Supervised`، `Unsupervised`، `Reinforcement`، `Representation`، `Optimization`، `Evaluation` | تعلّم النماذج من البيانات |
| 5 | Linear Regression & Rule Learning | `Gradient Descent`، `Cost Function`، `Decision Trees` | تطبيق خوارزميات التعلم |

---

## الجزء الأول: الشرح التفصيلي (سطر بسطر / شريحة بشريحة)

---

### 1. ما هو تعلم الآلة؟ — What is Machine Learning?

**النص الأصلي يقول:**
> *"Learning is any process by which a system improves performance from experience."* — Herbert Simon
>
> *Definition by Tom Mitchell (1998): Machine Learning is the study of algorithms that improve their performance P at some task T with experience E. A well-defined learning task is given by ⟨P, T, E⟩.*

**الشرح المبسّط:**

`Machine Learning` هو فرع من الذكاء الاصطناعي يُمكّن الحاسوب من **التحسين الذاتي** دون أن يُبرمَج صريحاً لكل خطوة. بدلاً من كتابة قواعد يدوية، نعطي الحاسوب بيانات وتجارب، فيستخلص القواعد بنفسه.

تعريف Mitchell يُقسِّم أي مهمة تعلم إلى ثلاثة عناصر:
- **T (Task):** المهمة المطلوبة — ماذا يجب أن يفعل النظام؟
- **P (Performance):** مقياس الأداء — كيف نقيس نجاحه؟
- **E (Experience):** التجربة — ما البيانات التي يتعلم منها؟

#### 💡 التشبيه:
> تعلم الآلة يشبه تدريب طالب جديد بالحياة: لا نعطيه كتاب قواعد يحفظه، بل نضعه في مواقف حقيقية (تجارب)، فيتعلم كيف يتصرف ويتحسن تدريجياً.
> **وجه الشبه:** التجارب الحياتية = `Experience E` | حسن التصرف = `Performance P` | الوظيفة = `Task T`

#### مهم للامتحان ⚠️:
> الثلاثي ⟨P, T, E⟩ هو الهيكل الرسمي لأي مسألة تعلم. إذا لم تستطع تعريف هذه العناصر الثلاثة بوضوح، فالمسألة غير محددة تعلّمياً.

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** في مسألة تصفية البريد المزعج (`Spam Filtering`)، ما هو T وما هو P وما هو E؟
> **لماذا هذا مهم؟** لأن تحديد هذه العناصر هو الخطوة الأولى لبناء أي نظام تعلم.

---

### 1.1. الفرق بين البرمجة التقليدية وتعلم الآلة

**النص الأصلي يقول:**
> [من المخطط في المحاضرة]
> - `Traditional Programming`: Data + Program → Computer → Output
> - `Machine Learning`: Data + Output → Computer → Program

**الشرح المبسّط:**

| الجانب | البرمجة التقليدية | تعلم الآلة |
|---|---|---|
| المدخلات | بيانات + برنامج (قواعد يدوية) | بيانات + مخرجات مطلوبة |
| المخرجات | نتيجة | برنامج (نموذج مُتعلَّم) |
| دور المبرمج | يكتب القواعد بنفسه | يوفر البيانات والأمثلة |
| المرونة | محدودة — صارمة | عالية — تتكيف مع البيانات |

#### 💡 التشبيه:
> البرمجة التقليدية كالطبخ بوصفة مكتوبة (القواعد موجودة). تعلم الآلة كتعلم الطبخ بالتذوق والتجربة — الطفل يأكل آلاف الوجبات ثم يستنتج وصفته الخاصة.
> **وجه الشبه:** الوصفة المكتوبة = البرنامج التقليدي | التذوق والتجربة = التدريب على البيانات

#### 🔄 قبل / بعد: التحول من البرمجة التقليدية لتعلم الآلة

**قبل (Traditional Programming):**
```text
Input:  Data + Handwritten Rules (Program)
Output: Result/Answer
```

**بعد (Machine Learning):**
```text
Input:  Data + Known Results (Labels)
Output: Learned Model (Program discovered automatically)
```

**ماذا تغيّر؟** المبرمج لم يعد يكتب القواعد — النظام يستخلصها بنفسه من الأمثلة.

---

### 2. متى نستخدم تعلم الآلة؟ — When Do We Use ML?

**النص الأصلي يقول:**
> ML is used when:
> - Human expertise does not exist (navigating on Mars)
> - Humans can't explain their expertise (speech recognition)
> - Models must be customized (personalized medicine)
> - Models are based on huge amounts of data (genomics)
>
> Learning isn't always useful:
> - There is no need to "learn" to calculate payroll

**الشرح المبسّط:**

نستخدم `Machine Learning` في أربعة سيناريوهات:

| السيناريو | الشرح | مثال |
|---|---|---|
| الخبرة الإنسانية غير موجودة | لا يوجد بشر خبراء في المجال | التنقل على المريخ |
| الخبرة موجودة لكن لا يمكن شرحها | البشر يفعلون الشيء لكن لا يعرفون كيف | `Speech Recognition` |
| النماذج تحتاج تخصيصاً | كل مستخدم مختلف | `Personalized Medicine` |
| البيانات ضخمة جداً | يستحيل معالجتها يدوياً | `Genomics` |

**متى لا نحتاج تعلم الآلة؟**
إذا كانت القواعد واضحة وثابتة ويمكن برمجتها يدوياً (مثال: حساب كشف الراتب `Payroll`).

#### 💡 التشبيه:
> نستخدم تعلم الآلة عندما تكون المهمة كتعرّف الوجوه — تفعلها بسهولة لكنك لا تستطيع شرح كيف! بينما حساب الضرائب قواعده واضحة ولا تحتاج تعلماً.
> **وجه الشبه:** التعرف على الوجوه = `Implicit Knowledge` يصعب برمجته يدوياً

**الفهم الخاطئ الشائع ❌:** "تعلم الآلة أفضل دائماً من البرمجة التقليدية."
**الفهم الصحيح ✅:** تعلم الآلة يُستخدم فقط حين تكون المسألة غير محددة القواعد أو القواعد يصعب كتابتها يدوياً.

---

### 2.1. أمثلة كلاسيكية — Classic Examples

**النص الأصلي يقول:**
> A classic example: It is very hard to say what makes a 2 [مثال على أرقام مكتوبة بخط اليد]

**الشرح المبسّط:**

التعرف على الأرقام المكتوبة يدوياً (`Handwritten Digit Recognition`) مثال مثالي لـ `Machine Learning`:
- الرقم "2" يُكتب بطرق مختلفة جداً من شخص لآخر
- يستحيل كتابة قواعد يدوية تصف كل الأشكال الممكنة للرقم "2"
- النظام يتعلم من آلاف الأمثلة المُصنَّفة

**مهام أخرى مناسبة لتعلم الآلة:**

| فئة المهمة | أمثلة |
|---|---|
| `Recognizing Patterns` | التعرف على الوجوه، الكلام المنطوق، الصور الطبية |
| `Generating Patterns` | توليد صور أو تسلسلات حركية |
| `Recognizing Anomalies` | كشف معاملات بطاقات الائتمان المشبوهة، أخطاء المفاعل النووي |
| `Prediction` | التنبؤ بأسعار الأسهم أو أسعار صرف العملات |

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** لماذا لا يمكن كتابة برنامج تقليدي يتعرف على جميع أشكال الرقم "2"؟
> **لماذا هذا مهم؟** يُوضح لماذا `Machine Learning` ضروري: التنوع اللانهائي في البيانات الحقيقية يجعل القواعد اليدوية مستحيلة.

---

### 2.2. تطبيقات نموذجية — Sample Applications

**النص الأصلي يقول:**
> Sample Applications: Web search، Computational biology، Finance، E-commerce، Space exploration، Robotics، Information extraction، Social networks، Debugging software

**الشرح المبسّط:**

`Machine Learning` منتشر في كل مكان:

| التطبيق | كيف يُستخدم تعلم الآلة |
|---|---|
| `Web Search` | ترتيب نتائج البحث، فهم النية وراء الاستعلام |
| `Computational Biology` | تحليل الجينوم والبروتينات |
| `Finance` | كشف الاحتيال، التنبؤ بالأسواق |
| `E-Commerce` | توصيات المنتجات، تخصيص العروض |
| `Space Exploration` | تحليل صور الكواكب، التنقل الذاتي |
| `Robotics` | التعلم من البيئة، التكيف مع المواقف الجديدة |
| `Information Extraction` | استخراج المعلومات من النصوص |
| `Social Networks` | تحليل السلوك، اكتشاف المجتمعات |
| `Debugging Software` | اكتشاف الأخطاء البرمجية تلقائياً |

---

### 3. Samuel's Checkers-Player (نقطة تاريخية)

**النص الأصلي يقول:**
> *"Machine Learning: Field of study that gives computers the ability to learn without being explicitly programmed."* — Arthur Samuel (1959)

**الشرح المبسّط:**

`Arthur Samuel` عام 1959 بنى برنامجاً يلعب الداما (`Checkers`) ويتعلم من الأخطاء دون أن يُبرمَج بقواعد اللعبة صريحة. هذا هو التعريف التاريخي الأول لـ `Machine Learning`.

#### ملاحظة:
> تعريف Samuel أقدم وأبسط من تعريف Mitchell الأكثر دقة. في الامتحانات، كلاهما مقبول لكن تعريف Mitchell (⟨P, T, E⟩) أكثر دقة ورسمية.

---

### 4. تحديد مهمة التعلم — Defining the Learning Task

**النص الأصلي يقول:**
> Improve on task T, with respect to performance metric P, based on experience E
>
> - T: Playing checkers | P: Percentage of games won | E: Playing practice games against itself
> - T: Recognizing hand-written words | P: Percentage of words correctly classified | E: Database of human-labeled images
> - T: Driving on four-lane highways | P: Average distance before a human-judged error | E: Images and steering commands from human driver
> - T: Categorize email as spam | P: % of emails correctly classified | E: Database of emails, some with human-given labels

**الشرح المبسّط:**

كل مسألة تعلم ترجمتها إلى ⟨T, P, E⟩:

| المسألة | T (المهمة) | P (الأداء) | E (التجربة) |
|---|---|---|---|
| لعب الداما | لعب مباريات الداما | نسبة المباريات المكسوبة | مباريات تجريبية ضد النفس |
| التعرف على الكلمات | تصنيف الكلمات المكتوبة | نسبة الكلمات الصحيحة | قاعدة بيانات صور مُصنَّفة بشرياً |
| قيادة السيارة | القيادة على الطريق | متوسط المسافة قبل خطأ بشري | صور وأوامر توجيه من سائق بشري |
| تصفية البريد | تصنيف بريد مزعج/شرعي | نسبة الرسائل الصحيحة | قاعدة بيانات رسائل بتصنيفات بشرية |

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** إذا أردنا نظاماً يتعرف على الأمراض من صور أشعة X، ما هو ⟨T, P, E⟩؟
> **الإجابة:** T = تصنيف الصور (مريض/سليم) | P = نسبة التشخيص الصحيح | E = قاعدة بيانات صور مُصنَّفة من أطباء.

---

### 5. أنواع التعلم — Types of Learning

**النص الأصلي يقول:**
> - Supervised (inductive) learning: Given training data + desired outputs (labels)
> - Unsupervised learning: Given training data (without desired outputs)
> - Semi-supervised learning: Given training data + a few desired outputs
> - Reinforcement learning: Rewards from sequence of actions

**الشرح المبسّط:**

هناك أربعة أنواع رئيسية:

| النوع | ما يُعطى للنظام | ما يُتعلَّم | مثال |
|---|---|---|---|
| `Supervised Learning` | بيانات + تسميات (labels) | دالة تنبؤية | تصنيف بريد مزعج |
| `Unsupervised Learning` | بيانات فقط (بدون labels) | بنية خفية في البيانات | تجميع (`Clustering`) |
| `Semi-supervised Learning` | بيانات + عدد قليل من التسميات | نموذج بكفاءة أعلى | تصنيف طبي بعينات قليلة مُصنَّفة |
| `Reinforcement Learning` | تسلسل حالات وأفعال مع مكافآت | سياسة (policy) اتخاذ القرار | الروبوت في المتاهة، لعب الألعاب |

#### 💡 التشبيه:
> - `Supervised`: طالب يدرس من كتاب به الأسئلة والإجابات.
> - `Unsupervised`: طالب يفرز مجموعة أوراق مبعثرة بدون تعليمات.
> - `Semi-supervised`: طالب لديه بعض الإجابات فقط.
> - `Reinforcement`: طفل يتعلم ركوب الدراجة بالتجربة والخطأ والمكافأة.
> **وجه الشبه:** المكافأة والعقاب = `Reward Signal` | السياسة = `Policy`

---

### 5.1. التعلم الخاضع للإشراف — Supervised Learning: Regression

**النص الأصلي يقول:**
> Given (x₁, y₁), (x₂, y₂), …, (xₙ, yₙ)
> Learn a function f(x) to predict y given x
> y is real-valued == regression

**الشرح المبسّط:**

في `Supervised Learning`، النظام يتعلم دالة $f(x)$ من أمثلة مُصنَّفة.

إذا كانت $y$ قيمة حقيقية (عدد)، نسمي المهمة **`Regression`**.
إذا كانت $y$ تنتمي لفئة (فئة أ أو ب)، نسمي المهمة **`Classification`**.

#### 📐 المعادلة: دالة التعلم الخاضع للإشراف

$$
f: X \rightarrow Y
$$

**الشرح:**
> - $X$: فضاء المدخلات (المتغيرات المستقلة)
> - $Y$: فضاء المخرجات (المتغير التابع)
> - $f$: الدالة المُتعلَّمة التي تُعيِّن كل مدخل بمخرج

مثال من المحاضرة: بيانات انحسار الجليد في القطب الشمالي (Arctic Sea Ice) بدلالة السنة — هذا regression.

---

### 5.2. التعلم غير الخاضع للإشراف — Unsupervised Learning

**النص الأصلي يقول:**
> Given x₁, x₂, …, xₙ (without labels)
> Output hidden structure behind the x's
> E.g., clustering

**الشرح المبسّط:**

في `Unsupervised Learning`، البيانات بدون تسميات. الهدف اكتشاف البنية الخفية في البيانات:

- **`Clustering`:** تجميع النقاط المتشابهة معاً (مثل تجميع العملاء حسب السلوك الشرائي)
- **`Dimensionality Reduction`:** تقليل عدد المتغيرات مع الحفاظ على المعلومات **(شرح زيادة للفهم)**
- **`Density Estimation`:** تقدير توزيع البيانات **(غير مشروحة في المحاضرة)**

#### 💡 التشبيه:
> `Clustering` يشبه فرز الملابس في خزانتك: لا أحد أخبرك بالتصنيف — أنت تجمع ما يتشابه (بناطيل مع بناطيل، قمصان مع قمصان) بحدسك.
> **وجه الشبه:** التشابه بين الملابس = `Distance Metric` في الخوارزمية

---

### 5.3. التعلم المعزز — Reinforcement Learning

**النص الأصلي يقول:**
> Given a sequence of states and actions with (delayed) rewards, output a policy
> Policy is a mapping from states → actions that tells you what to do in a given state
> Examples: Credit assignment problem، Game playing، Robot in a maze، Balance a pole on your hand

**الشرح المبسّط:**

في `Reinforcement Learning`، لا توجد بيانات تدريب مسبقة. النظام يتفاعل مع البيئة:
1. يلاحظ الحالة الحالية (`State`)
2. يتخذ فعلاً (`Action`)
3. يتلقى مكافأة أو عقاباً (`Reward`)
4. يحدّث استراتيجيته (`Policy`)

#### 📐 المعادلة: السياسة في التعلم المعزز

$$
\pi: S \rightarrow A
$$

**الشرح:**
> - $\pi$: السياسة (`Policy`) — ماذا أفعل في كل حالة؟
> - $S$: فضاء الحالات (`State Space`)
> - $A$: فضاء الأفعال (`Action Space`)

**المفهوم الحرج — Delayed Reward:** المكافأة لا تأتي فوراً — قرار اليوم قد يؤثر على نتيجة الغد.

#### مهم للامتحان ⚠️:
> مشكلة `Credit Assignment` هي تحديد أي الأفعال في تسلسل طويل كانت مسؤولة عن النتيجة النهائية (الفوز أو الخسارة). هذه من أصعب مشاكل `Reinforcement Learning`.

---

### 6. تصميم نظام التعلم — Designing a Learning System

**النص الأصلي يقول:**
> - Choose the training experience
> - Choose exactly what is to be learned — i.e. the target function
> - Choose how to represent the target function
> - Choose a learning algorithm to infer the target function from the experience

**الشرح المبسّط:**

لبناء أي نظام تعلم، نمر بأربع خطوات:

#### ⚙️ الخطوات / الخوارزمية: تصميم نظام التعلم

```algorithm
1 | اختر التجربة التدريبية | Training Data | ما البيانات التي سيتعلم منها النظام؟ نوع التعلم؟ هل هي مُصنَّفة؟
2 | حدد ما يجب تعلمه | Target Function | ما الدالة المستهدفة التي نريد تعلمها؟
3 | اختر تمثيل الدالة | Representation | كيف نُمثّل الدالة؟ (شبكة عصبية، شجرة قرار، خط انحدار)
4 | اختر خوارزمية التعلم | Learning Algorithm | ما الخوارزمية التي تستنتج الدالة من التجربة؟
```

#### 📊 المخطط: دورة نظام التعلم

#### ما هذا المخطط؟
> يُوضح كيف يأخذ نظام التعلم البيانات التدريبية ويُنتج معرفة تُستخدم لاحقاً في أداء المهمة على بيانات الاختبار.

#### وصف العُقد:

| # | العُقدة | النوع | الشرح |
|---|---|---|---|
| 1 | Environment/Experience | مصدر | البيئة التي تُولِّد البيانات |
| 2 | Learner | عملية | يتعلم من بيانات التدريب |
| 3 | Knowledge | مخزن | النموذج المُتعلَّم |
| 4 | Performance Element | عملية | يستخدم المعرفة على بيانات الاختبار |

#### وصف الروابط:

| من | إلى | التسمية | نوع السهم | الشرح |
|---|---|---|---|---|
| Environment | Learner | Training data | ← | بيانات التدريب تذهب للمتعلم |
| Learner | Knowledge | — | ← | المتعلم يُنتج المعرفة/النموذج |
| Environment | Performance Element | Testing data | ← | بيانات الاختبار تذهب لعنصر الأداء |
| Knowledge | Performance Element | — | ← | المعرفة تُوجّه الأداء |

```diagram
type: flowchart
title: Learning System Architecture
direction: TD
nodes:
  - id: env
    label: Environment/Experience
    kind: data
    level: 0
  - id: learner
    label: Learner
    kind: process
    level: 1
  - id: knowledge
    label: Knowledge (Model)
    kind: store
    level: 2
  - id: perf
    label: Performance Element
    kind: process
    level: 2
edges:
  - from: env
    to: learner
    label: Training data
  - from: learner
    to: knowledge
    label: learns
  - from: env
    to: perf
    label: Testing data
  - from: knowledge
    to: perf
    label: guides
```

---

### 7. تعلم الآلة في لمحة — ML in a Nutshell

**النص الأصلي يقول:**
> Tens of thousands of machine learning algorithms — Hundreds new every year
> Every ML algorithm has three components: Representation، Optimization، Evaluation

**الشرح المبسّط:**

كل خوارزمية تعلم — مهما كان نوعها — تتكون من ثلاثة مكونات أساسية:

| المكوّن | التعريف | مثال |
|---|---|---|
| `Representation` | كيف نُمثّل النموذج المتعلَّم؟ | شجرة قرار، شبكة عصبية، خط |
| `Optimization` | كيف نُحسّن النموذج؟ | `Gradient Descent`، `Divide and Conquer` |
| `Evaluation` | كيف نقيس جودة النموذج؟ | `Accuracy`، `Squared Error`، `Entropy` |

#### مهم للامتحان ⚠️:
> هذه المكونات الثلاثة هي إطار تحليل أي خوارزمية. في الامتحان، قد تُسأل: "ما `Representation` و`Optimization` و`Evaluation` في خوارزمية X؟"

---

### 7.1. تمثيلات الدوال — Various Function Representations

**النص الأصلي يقول:**
> - Numerical functions: Linear regression، Neural networks، Support vector machines
> - Symbolic functions: Decision trees، Rules in propositional logic، Rules in first-order predicate logic
> - Instance-based functions: Nearest-neighbor، Case-based
> - Probabilistic Graphical Models: Naïve Bayes، Bayesian networks، Hidden-Markov Models (HMMs)، PCFGs، Markov networks

**الشرح المبسّط:**

#### جدول التمثيلات المتاحة:

| فئة التمثيل | أمثلة | الخاصية الرئيسية |
|---|---|---|
| `Numerical Functions` | `Linear Regression`، `Neural Networks`، `SVM` | دوال رياضية مستمرة |
| `Symbolic Functions` | `Decision Trees`، قواعد المنطق | قواعد قابلة للقراءة البشرية |
| `Instance-based Functions` | `Nearest-Neighbor`، `Case-based` | يُخزَّن التدريب كاملاً، لا يُبنى نموذج |
| `Probabilistic Graphical Models` | `Naïve Bayes`، `Bayesian Networks`، `HMMs`، `PCFGs`، `Markov Networks` | تُمثّل الاحتمالية والشك |

#### ⚖️ المقايضة: Symbolic vs Numerical vs Instance-based

| | `Symbolic` | `Numerical` | `Instance-based` |
|---|---|---|---|
| المزايا | قابل للتفسير | دقيق ومرن | لا يحتاج تدريباً مسبقاً |
| العيوب | محدود في التعقيد | صعب التفسير | بطيء عند الاستدلال |
| متى تختاره | عندما التفسير ضروري | مسائل معقدة كبيرة البيانات | بيانات قليلة ومتنوعة |

---

### 7.2. خوارزميات البحث والتحسين — Various Search/Optimization Algorithms

**النص الأصلي يقول:**
> - Gradient descent: Perceptron، Backpropagation
> - Dynamic Programming: HMM Learning، PCFG Learning
> - Divide and Conquer: Decision tree induction، Rule learning
> - Evolutionary Computation: Genetic Algorithms (GAs)، Genetic Programming (GP)، Neuro-evolution

**الشرح المبسّط:**

خوارزميات التحسين هي المكوّن الثاني من الثلاثي:

| الأسلوب | الآلية | الخوارزميات |
|---|---|---|
| `Gradient Descent` | اتباع اتجاه الانحدار في فضاء الأوزان | `Perceptron`، `Backpropagation` |
| `Dynamic Programming` | تقسيم المسألة لمسائل فرعية يُحل كل منها مرة | `HMM Learning`، `PCFG Learning` |
| `Divide and Conquer` | التقسيم الانتقائي حتى الوصول للأوراق | `Decision Tree Induction`، `Rule Learning` |
| `Evolutionary Computation` | محاكاة التطور الطبيعي والانتقاء الطبيعي | `GAs`، `GP`، `Neuro-evolution` |

---

### 7.3. معايير التقييم — Evaluation

**النص الأصلي يقول:**
> Accuracy، Precision and recall، Squared error، Likelihood، Posterior probability، Cost/Utility، Margin، Entropy، K-L divergence، etc.

**الشرح المبسّط:**

#### جدول معايير التقييم:

| المعيار | يُستخدم في | معناه |
|---|---|---|
| `Accuracy` | التصنيف | نسبة التصنيفات الصحيحة |
| `Precision & Recall` | كشف المعلومات | الدقة والاسترجاع |
| `Squared Error` | الانحدار | مجموع مربعات الأخطاء |
| `Likelihood` | النماذج الاحتمالية | مدى احتمالية البيانات بالمعلمات الحالية |
| `Posterior Probability` | Bayesian Models | الاحتمال البعدي بعد مشاهدة البيانات |
| `Cost / Utility` | التعلم المعزز | تكلفة القرار أو فائدته |
| `Entropy` | أشجار القرار، المعلومات | قياس عدم اليقين |
| `K-L Divergence` | النماذج الاحتمالية | الفرق بين توزيعين |

---

### 8. تعلم الآلة في الممارسة — ML in Practice

**النص الأصلي يقول:**
> Loop:
> - Understand domain, prior knowledge, and goals
> - Data integration, selection, cleaning, pre-processing, etc.
> - Learn models
> - Interpret results
> - Consolidate and deploy discovered knowledge

**الشرح المبسّط:**

تطبيق `Machine Learning` في الواقع عملية تكرارية (`Iterative`):

#### ⚙️ الخطوات / الخوارزمية: ML Pipeline

```algorithm
1 | فهم المجال والهدف      | Domain Expert + Stakeholders | ما المشكلة؟ ما البيانات المتاحة؟ ما الهدف النهائي؟
2 | تكامل البيانات وتنظيفها | Data Preprocessing Tools     | جمع البيانات، تنظيف القيم الناقصة، تطبيع المتغيرات
3 | تعلم النماذج            | ML Algorithms                | اختيار الخوارزمية وتدريب النموذج
4 | تفسير النتائج           | Evaluation Metrics           | هل النموذج جيد؟ أين يُخطئ؟
5 | نشر المعرفة             | Deployment System            | دمج النموذج في النظام الإنتاجي، المراقبة المستمرة
```

#### ملاحظة:
> هذه الخطوات حلقية (`Loop`) — تفسير النتائج غالباً يؤدي للعودة لخطوة تحسين البيانات أو تغيير الخوارزمية.

---

### 9. الدروس المستفادة — Lessons Learned about Learning

**النص الأصلي يقول:**
> - Learning can be viewed as using direct or indirect experience to approximate a chosen target function.
> - Function approximation can be viewed as a search through a space of hypotheses for one that best fits a set of training data.
> - Different learning methods assume different hypothesis spaces and/or employ different search techniques.

**الشرح المبسّط:**

ثلاثة دروس أساسية تلخص فلسفة تعلم الآلة:

| الدرس | الشرح |
|---|---|
| التعلم = تقريب دالة | نستخدم التجربة لنقترب من الدالة المثالية التي لا نعرفها |
| تقريب الدالة = بحث | نبحث في فضاء الفرضيات (`Hypothesis Space`) عن أفضل نموذج يناسب البيانات |
| الطرق المختلفة = فرضيات مختلفة | كل خوارزمية تفترض شكلاً مختلفاً للحل (خط، شجرة، شبكة...) |

#### الدرس المستفاد:
> الفرق بين `Decision Tree` و`Neural Network` ليس فقط في الأداء — بل في الافتراض المسبق عن **شكل** الحل. هذا الافتراض يُسمى `Inductive Bias`.

---

### 10. تطبيقات متقدمة — State of the Art Applications

**النص الأصلي يقول:**
> - Autonomous Cars (السيارات ذاتية القيادة)
> - Deep Belief Net on Face Images (الشبكات العميقة على صور الوجوه)
> - Learning of Object Parts
> - Scene Labeling via Deep Learning

**الشرح المبسّط:**

#### 10.1. السيارات ذاتية القيادة

`Autonomous Cars` مثال رائع على تعلم الآلة في الواقع:
- المهمة T: القيادة الآمنة على الطريق
- الأداء P: متوسط المسافة قبل خطأ يحكم عليه بشري
- التجربة E: تسجيلات قيادة بشرية (صور + أوامر توجيه)

#### 10.2. الشبكات العميقة على صور الوجوه — Deep Belief Net

`Deep Learning` يتعلم تمثيلات هرمية (`Hierarchical Representations`):
```
Pixels → Edges → Object Parts → Object Models
```

#### ملاحظة:
> هذا يُشبه كيف يعالج الدماغ البشري الصور: من مستوى البكسلات إلى الحواف إلى الأجزاء إلى الوجه الكامل.

---

## الجزء الثاني: ملخص منظّم

### جدول تعريفات المصطلحات الرئيسية (Glossary)

| المصطلح | التعريف |
|---|---|
| `Machine Learning` | دراسة الخوارزميات التي تُحسّن أداءها على مهمة معينة من خلال التجربة |
| `Task T` | المهمة التي يؤديها نظام التعلم |
| `Performance P` | المقياس الذي يقيّم مدى إتقان المهمة |
| `Experience E` | البيانات أو التفاعلات التي يتعلم منها النظام |
| `Supervised Learning` | تعلم من بيانات مُصنَّفة (بيانات + تسميات) |
| `Unsupervised Learning` | تعلم من بيانات غير مُصنَّفة (اكتشاف بنية خفية) |
| `Semi-supervised Learning` | تعلم من بيانات معظمها غير مُصنَّف وقليل منها مُصنَّف |
| `Reinforcement Learning` | تعلم من المكافآت عبر التفاعل مع البيئة |
| `Representation` | كيفية تمثيل النموذج المتعلَّم |
| `Optimization` | كيفية البحث عن أفضل نموذج |
| `Evaluation` | كيفية قياس جودة النموذج |
| `Target Function` | الدالة المثالية التي نسعى لتقريبها |
| `Hypothesis Space` | مجموعة كل النماذج الممكنة يبحث فيها الخوارزمية |
| `Policy` | تعيين الحالات للأفعال في `Reinforcement Learning` |
| `Clustering` | تجميع البيانات المتشابهة معاً بدون تسميات |
| `Inductive Bias` | الافتراض المسبق الذي تُقيّد به الخوارزمية فضاء الفرضيات **(شرح زيادة للفهم)** |

---

### مقارنة أنواع التعلم

| المعيار | `Supervised` | `Unsupervised` | `Reinforcement` |
|---|---|---|---|
| هل هناك labels؟ | نعم | لا | جزئياً (reward) |
| المخرج | دالة تنبؤية | بنية/تجميع | سياسة (policy) |
| مثال | spam filter | clustering | robot navigation |
| التغذية الراجعة | فورية (labels) | لا يوجد | متأخرة (delayed reward) |
| الصعوبة | متوسط | صعب (لا إشراف) | صعب جداً (credit assignment) |

---

### النقاط الذهبية

1. كل مسألة تعلم تحتاج تعريف ⟨T, P, E⟩ أولاً.
2. `ML` للمهام التي يصعب فيها كتابة القواعد يدوياً.
3. كل خوارزمية = `Representation` + `Optimization` + `Evaluation`.
4. `Supervised` يحتاج بيانات مُصنَّفة؛ `Unsupervised` يعمل بدونها.
5. `Reinforcement Learning` يتعلم من المكافآت المتأخرة.
6. تطبيق ML في الواقع عملية تكرارية وليست خطية.

---

### الأخطاء الشائعة

| الخطأ | التصحيح |
|---|---|
| استخدام ML لكل مسألة | ML فقط للمسائل غير المحددة القواعد أو الضخمة البيانات |
| الخلط بين Regression و Classification | `Regression`: مخرج حقيقي | `Classification`: مخرج فئة |
| الاعتقاد أن Unsupervised أسهل | أصعب لأن لا يوجد تغذية راجعة |
| تجاهل مرحلة تنظيف البيانات | البيانات الجيدة أهم من الخوارزمية الجيدة |
| الخلط بين Policy و Q-Function في RL | `Policy` تُعيّن الحالة للفعل؛ `Q-Function` تُقيّم جودة الفعل **(شرح زيادة للفهم)** |

---

## خطوات وإجراءات المحاضرة

### خوارزمية: تصميم نظام تعلم خاضع للإشراف (Supervised ML Pipeline)

```algorithm
1 | جمع البيانات المُصنَّفة   | Data Collection    | الحصول على أمثلة (x_i, y_i) للتدريب
2 | تقسيم البيانات            | Train/Test Split    | 80% تدريب، 20% اختبار
3 | اختيار التمثيل            | Model Selection     | خط انحدار؟ شجرة قرار؟ شبكة عصبية؟
4 | تدريب النموذج             | Optimization        | تشغيل خوارزمية التحسين على بيانات التدريب
5 | تقييم النموذج             | Evaluation          | قياس الأداء على بيانات الاختبار
6 | ضبط المعلمات الفائقة      | Hyperparameter Tuning | تعديل learning rate، depth، إلخ
7 | النشر                     | Deployment          | دمج النموذج في النظام الإنتاجي
```

---

## الجزء الثالث: أسئلة اختيار من متعدد (MCQ)

### السيناريو 1: تطبيق ⟨T, P, E⟩

> نظام يتعلم تصفية رسائل البريد الإلكتروني المزعجة. عُطيت النظامَ قاعدة بيانات من 10,000 رسالة، 60% منها بريد مزعج مُصنَّف بشرياً. النظام يُحسّن نسبة التصنيف الصحيح.

---

#### السؤال 1.1 (hard): ما هو العنصر E في هذه المسألة؟

أ) نسبة التصنيف الصحيح
ب) تصنيف رسائل البريد كمزعج أو شرعي
ج) قاعدة البيانات من 10,000 رسالة مُصنَّفة بشرياً
د) خوارزمية التصنيف المستخدمة

**الإجابة الصحيحة: ج**

**التعليل:**
- أ) خطأ — هذا هو P (مقياس الأداء)
- ب) خطأ — هذا هو T (المهمة)
- ج) **صحيح** — E هو التجربة التي يتعلم منها النظام، وهي البيانات المُصنَّفة
- د) خطأ — الخوارزمية جزء من الحل وليست من العناصر ⟨T, P, E⟩

---

#### السؤال 1.2 (hard): ما نوع التعلم المناسب لهذه المسألة؟

أ) `Unsupervised Learning`
ب) `Reinforcement Learning`
ج) `Supervised Learning`
د) `Semi-supervised Learning` فقط لأن 40% من البيانات غير مُصنَّفة

**الإجابة الصحيحة: ج**

**التعليل:**
- أ) خطأ — Unsupervised لا يستخدم التسميات، لكن لدينا 60% مُصنَّفة
- ب) خطأ — Reinforcement يتعلم من المكافآت لا من بيانات مُصنَّفة
- ج) **صحيح** — لدينا بيانات + تسميات = Supervised Learning
- د) خاطئ جزئياً — يمكن استخدام Semi-supervised لاستغلال البيانات غير المُصنَّفة لكنه ليس الوحيد الصحيح

---

#### السؤال 1.3 (medium): أي التالية يُمثّل P في مسألة قيادة السيارة الذاتية؟

أ) الصور المسجّلة من كاميرا السيارة
ب) متوسط المسافة قبل خطأ يحكم عليه بشري
ج) القيادة الآمنة على طريق ذي 4 مسارات
د) أوامر التوجيه الصادرة من السائق البشري

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — هذا جزء من E (التجربة)
- ب) **صحيح** — هذا مقياس الأداء P كما ورد في المحاضرة حرفياً
- ج) خطأ — هذا T (المهمة)
- د) خطأ — هذا أيضاً جزء من E (التجربة)

---

### السيناريو 2: تتبع خوارزمية تعلم

> نظام تعلم يستخدم `Decision Tree` (شجرة قرار) لتصنيف أزهار إلى فئتين. التمثيل هو شجرة ثنائية، التحسين هو `Divide and Conquer` (Information Gain)، والتقييم هو `Accuracy`.

---

#### السؤال 2.1 (hard): أي المكونات الثلاثة يقرر كيف يُقسَّم النموذج داخلياً؟

أ) `Evaluation`
ب) `Representation`
ج) `Optimization`
د) `Target Function`

**الإجابة الصحيحة: ج**

**التعليل:**
- أ) خطأ — Evaluation يقيس الجودة لا يُقسّم
- ب) خطأ — Representation يحدد شكل النموذج (شجرة) لا كيف نبنيها
- ج) **صحيح** — Optimization (هنا Divide and Conquer بـ Information Gain) يُحدد كيف نبني الشجرة
- د) خطأ — Target Function هي الدالة المثالية التي نحاول تقريبها

---

#### السؤال 2.2 (medium): إذا غيّرنا `Accuracy` إلى `Entropy` كمعيار تقييم، أي مكوّن يتغير؟

أ) `Representation`
ب) `Optimization`
ج) `Evaluation`
د) كلاهما Representation و Optimization

**الإجابة الصحيحة: ج**

**التعليل:**
- أ) خطأ — التمثيل (شجرة قرار) لم يتغير
- ب) خطأ — أسلوب البناء (Divide and Conquer) لم يتغير
- ج) **صحيح** — فقط معيار القياس (Evaluation) تغيّر
- د) خطأ — تغيير معيار الجودة لا يؤثر على الآخرين مباشرة

---

### السيناريو 3: اختيار نوع التعلم

> شركة تريد تجميع عملائها في مجموعات متشابهة السلوك الشرائي. لا تعرف الشركة مسبقاً كم عدد المجموعات أو ما خصائص كل مجموعة.

---

#### السؤال 3.1 (medium): أي نوع تعلم الأنسب؟

أ) `Supervised Learning` باستخدام تسميات يدوية لكل عميل
ب) `Unsupervised Learning` مثل `Clustering`
ج) `Reinforcement Learning` بمكافأة لكل تجميع صحيح
د) `Semi-supervised Learning` بتصنيف عينة صغيرة يدوياً

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — لا نملك تسميات مسبقة، وبناء تسميات يدوية يُفقد المعنى
- ب) **صحيح** — لا تسميات + نريد اكتشاف بنية خفية = Unsupervised/Clustering
- ج) خطأ — Reinforcement يحتاج بيئة تفاعلية ومكافآت
- د) خطأ — ليس الأنسب لأن المشكلة تستدعي اكتشافاً حراً لا تصنيفاً

---

#### السؤال 3.2 (hard): ما مشكلة استخدام `Supervised Learning` هنا؟

أ) يحتاج بيانات أكثر
ب) يحتاج تسميات مسبقة لكل عميل وهي غير متوفرة ومجهولة
ج) أبطأ من Unsupervised
د) لا يعمل مع بيانات العملاء

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — كمية البيانات ليست المشكلة الأساسية
- ب) **صحيح** — Supervised يحتاج labels معروفة مسبقاً، والمشكلة هنا أننا لا نعرف المجموعات
- ج) خطأ — السرعة ليست المانع الرئيسي
- د) خطأ — Supervised يعمل مع بيانات العملاء إذا توفرت labels

---

### السؤال 4 (medium): مقارنة أسلوبي التحسين

أي التالي يصف **الفرق الصحيح** بين `Gradient Descent` و `Divide and Conquer` كأساليب تحسين؟

أ) `Gradient Descent` يُستخدم فقط في Unsupervised، `Divide and Conquer` في Supervised
ب) `Gradient Descent` يتبع اتجاه الانحدار في فضاء مستمر؛ `Divide and Conquer` يُقسّم المساحة بانتقائية تكرارية
ج) `Gradient Descent` أسرع دائماً
د) `Divide and Conquer` يتطلب بيانات أكثر

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — كلاهما يُستخدم في أنواع مختلفة دون قيود كهذه
- ب) **صحيح** — هذا الفرق الجوهري: الأول يعمل في فضاء الأوزان المستمر؛ الثاني يُقسّم مسألة كبيرة لمسائل أصغر
- ج) خطأ — السرعة تعتمد على المسألة والبيانات
- د) خطأ — متطلبات البيانات تعتمد على الخوارزمية لا على أسلوب التحسين

---

### السؤال 5 (hard): تتبع ML Pipeline

وُصفت مسألة على النحو التالي: *"لدينا 50,000 صورة طبية، 5,000 منها مشخَّصة من أطباء. نريد نظاماً يُشخّص بقية الصور."*

أي الخطوات التالية يجب تطبيقها أولاً؟

أ) تدريب نموذج على 50,000 صورة مباشرة
ب) فهم المجال وتنظيف البيانات قبل التدريب
ج) اختيار `Reinforcement Learning` لأن البيانات غير مُصنَّفة في معظمها
د) تجاهل الـ45,000 غير المشخَّصة والتدريب على الـ5,000 فقط

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — 45,000 غير مُصنَّفة لن تُفيد Supervised مباشرة
- ب) **صحيح** — فهم المجال وتنظيف البيانات الخطوة الأولى دائماً في ML Pipeline
- ج) خطأ — Reinforcement غير مناسب هنا؛ لدينا بعض التسميات → Semi-supervised أو Supervised
- د) خطأ — يُضيّع 90% من البيانات؛ يفضل Semi-supervised

---

### السؤال 6 (medium): متى لا نستخدم تعلم الآلة؟

أي التالية لا يحتاج `Machine Learning`؟

أ) تصنيف تغريدات كإيجابية أو سلبية
ب) التعرف على الكلام العربي المنطوق
ج) حساب الفوائد البنكية بمعادلة ثابتة
د) اكتشاف أنماط غير عادية في بيانات المستشفى

**الإجابة الصحيحة: ج**

**التعليل:**
- أ) خطأ (يحتاج ML) — تحليل المشاعر مسألة نمط لا قاعدة ثابتة
- ب) خطأ (يحتاج ML) — Speech recognition مذكور صريحاً في المحاضرة
- ج) **صحيح** — القاعدة الرياضية ثابتة ومعروفة → برمجة تقليدية كافية
- د) خطأ (يحتاج ML) — Anomaly Detection من تطبيقات ML

---

### السؤال 7 (hard): Hypothesis Space

أي العبارات التالية تصف **بشكل صحيح** مفهوم `Hypothesis Space`؟

أ) هو مجموعة كل البيانات التدريبية
ب) هو مجموعة كل الدوال الممكنة التي قد تُمثّل الحل، يبحث فيها خوارزمية التعلم
ج) هو مساحة ذاكرة الحاسوب المخصصة للتعلم
د) هو التمثيل الوحيد الصحيح للنموذج

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — البيانات مستقلة عن فضاء الفرضيات
- ب) **صحيح** — Hypothesis Space هو الفضاء الذي يبحث فيه الخوارزمية عن أفضل نموذج
- ج) خطأ — مفهوم نظري وليس مادياً
- د) خطأ — قد يحتوي على آلاف النماذج الممكنة

---

### السؤال 8 (hard): Reinforcement Learning

في `Reinforcement Learning`، `Policy` هي:

أ) مجموعة الأفعال الممكنة للنظام
ب) تعيين كل حالة بالفعل الأمثل أو الاحتمالي
ج) قياس الأداء الكلي للنظام
د) قاعدة بيانات التجارب السابقة

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — هذا `Action Space`
- ب) **صحيح** — `Policy π: S → A` تُعيّن كل حالة بفعل (أو توزيع احتمالي على الأفعال)
- ج) خطأ — هذا `Cumulative Reward` أو `Value Function`
- د) خطأ — هذه `Experience Replay Buffer` في بعض الخوارزميات **(شرح زيادة للفهم)**

---

### السؤال 9 (medium): مكوّنات ML Algorithm

نظام `Naive Bayes` للتصنيف:
- التمثيل: `Probabilistic Graphical Model`
- التحسين: `Maximum Likelihood Estimation`
- التقييم: `Accuracy`

إذا استبدلنا التمثيل بـ`Decision Tree` مع الإبقاء على الباقي، ماذا يتغير؟

أ) لا شيء يتغير جوهرياً
ب) شكل الحل يتغير من احتمالي إلى شجري، مما قد يغيّر أسلوب التحسين المناسب
ج) فقط الـ Evaluation تتغير
د) يصبح النظام Unsupervised

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — التمثيل هو قلب الخوارزمية؛ تغييره جوهري
- ب) **صحيح** — تغيير التمثيل يستدعي تغيير خوارزمية التحسين (Decision Tree تستخدم Divide & Conquer لا MLE)
- ج) خطأ — Evaluation قد تبقى Accuracy لكنه ليس التغيير الوحيد
- د) خطأ — كلاهما Supervised

---

### السؤال 10 (hard): التعلم شبه الخاضع للإشراف

`Semi-supervised Learning` أفضل من `Supervised`순수 عندما:

أ) لا توجد بيانات مُصنَّفة إطلاقاً
ب) البيانات المُصنَّفة قليلة وتكلفة التصنيف البشري عالية
ج) المسألة تحتاج مكافآت بيئية
د) البيانات المُصنَّفة كثيرة جداً

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — بدون أي labels نستخدم Unsupervised
- ب) **صحيح** — Semi-supervised يستغل البيانات غير المُصنَّفة الكثيرة مع عينة مُصنَّفة صغيرة
- ج) خطأ — هذا يناسب Reinforcement
- د) خطأ — إذا كانت labels كثيرة، Supervised المجرد كافٍ

---

### السؤال 11 (medium): الفرق بين Regression و Classification

`Regression` يختلف عن `Classification` في أن:

أ) `Regression` يحتاج بيانات أكثر
ب) مخرج `Regression` قيمة حقيقية مستمرة، مخرج `Classification` فئة منفصلة
ج) `Regression` لا يحتاج بيانات تدريب
د) `Classification` دائماً أدق

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — الكمية لا تحدد النوع
- ب) **صحيح** — هذا الفرق الجوهري: سعر السهم (regression) vs. مريض/سليم (classification)
- ج) خطأ — كلاهما يحتاج بيانات تدريب
- د) خطأ — الدقة تعتمد على الخوارزمية والبيانات

---

### السؤال 12 (hard): تطبيق على ML Pipeline

أي الخطوات التالية **ليست** جزءاً من `ML in Practice` كما شرحته المحاضرة؟

أ) فهم المجال والأهداف
ب) تنظيف البيانات ومعالجتها
ج) شراء الخوارزمية الجاهزة من موردين خارجيين
د) تفسير النتائج ونشر المعرفة المكتشفة

**الإجابة الصحيحة: ج**

**التعليل:**
- أ) خطأ (موجودة في Pipeline)
- ب) خطأ (موجودة في Pipeline)
- ج) **صحيح** — هذه الخطوة غير مذكورة في ML Pipeline؛ Pipeline يركز على العملية الداخلية
- د) خطأ (موجودة في Pipeline)

---

### السؤال 13 (hard): عمق الشبكات العميقة

في مثال `Deep Belief Net on Face Images`، الترتيب الهرمي الصحيح من الأبسط للأكثر تعقيداً هو:

أ) Object Models → Object Parts → Edges → Pixels
ب) Pixels → Object Parts → Edges → Object Models
ج) Pixels → Edges → Object Parts → Object Models
د) Edges → Pixels → Object Models → Object Parts

**الإجابة الصحيحة: ج**

**التعليل:**
- أ) خطأ — العكس تماماً
- ب) خطأ — Object Parts تأتي بعد Edges
- ج) **صحيح** — هذا الترتيب الهرمي الصحيح كما في المحاضرة
- د) خطأ — Pixels هي الأساس وتأتي أولاً

---

### السؤال 14 (medium): تطبيق RL

في مسألة `Robot in a Maze`، ما الذي يُمثّل `Delayed Reward`؟

أ) قياس المسافة المتبقية للخروج في كل خطوة
ب) المكافأة تُعطى فقط عند الخروج من المتاهة لا في كل خطوة
ج) الروبوت يعرف مسبقاً أفضل مسار
د) المكافأة تُعطى عند كل فعل صحيح

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — هذا Immediate Feedback وليس Delayed
- ب) **صحيح** — Delayed Reward يعني الجائزة تأتي بعد سلسلة من الأفعال
- ج) خطأ — هذا ليس RL
- د) خطأ — هذا Immediate Reward

---

### السؤال 15 (hard): Instance-based Learning

لماذا `Nearest-Neighbor` يُصنَّف كـ`Instance-based Function Representation`؟

أ) لأنه يستخدم الشبكات العصبية
ب) لأنه يُخزّن جميع بيانات التدريب ويُصنَّف النقطة الجديدة بأقرب مثال مُخزَّن
ج) لأنه لا يحتاج أي بيانات
د) لأنه يبني نموذجاً صريحاً من البيانات

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — Neural Networks تمثيل عددي منفصل
- ب) **صحيح** — Instance-based يعني النموذج = البيانات المُخزَّنة نفسها، لا تعلم صريح
- ج) خطأ — يحتاج بيانات تدريب مُخزَّنة
- د) خطأ — على العكس، لا يبني نموذجاً صريحاً

---

### السؤال 16 (hard): تطبيق RL على Credit Assignment

مشكلة `Credit Assignment` في `Reinforcement Learning` تعني:

أ) تخصيص ميزانية للتدريب
ب) تحديد أي الأفعال في تسلسل طويل كانت المسؤولة عن النتيجة النهائية
ج) توزيع البيانات على أجهزة متعددة
د) تحديد عدد المكافآت في كل حلقة تدريب

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ — مصطلح من عالم المال لا ML
- ب) **صحيح** — Credit Assignment = تحديد مسؤولية الأفعال السابقة عن النتيجة الحالية
- ج) خطأ — هذا Distributed Computing
- د) خطأ — عدد المكافآت غير ذي صلة

---

### السؤال 17 (hard): ML is NOT Always Useful

أي الأمثلة التالية **لا** يستدعي استخدام `Machine Learning`؟

أ) التنبؤ بمعدل ضربات قلب مريض بعد ساعة
ب) حساب مساحة مستطيل بضرب الطول في العرض
ج) تصنيف صور أشعة X كطبيعية أو مريضة
د) اكتشاف أنماط تداول غير عادية في سوق الأسهم

**الإجابة الصحيحة: ب**

**التعليل:**
- أ) خطأ (يحتاج ML) — علاقة معقدة متعددة المتغيرات
- ب) **صحيح** — قاعدة رياضية بسيطة وثابتة → برمجة تقليدية
- ج) خطأ (يحتاج ML) — Pattern Recognition في صور طبية
- د) خطأ (يحتاج ML) — Anomaly Detection

---

### السؤال 18 (hard): مقارنة شاملة

اختر العبارة الأكثر **دقة واكتمالاً** لوصف `Machine Learning`:

أ) برمجة الحاسوب ليفعل ما نريده تلقائياً
ب) استخدام قواعد بيانات ضخمة فقط
ج) دراسة الخوارزميات التي تُحسّن أداءها P على مهمة T من خلال تجربة E، وتُمثَّل بمكونات Representation/Optimization/Evaluation
د) تعليم الحاسوب التفكير مثل الإنسان

**الإجابة الصحيحة: ج**

**التعليل:**
- أ) خطأ — وصف عام جداً، ينطبق على أي برمجة
- ب) خطأ — ML لا يتطلب بالضرورة بيانات ضخمة
- ج) **صحيح** — يجمع تعريف Mitchell + إطار ⟨T,P,E⟩ + المكونات الثلاثة = الوصف الأشمل
- د) خطأ — هذا وصف `General AI` وليس ML تحديداً

---

## الجزء الرابع: أسئلة تصحيح الخوارزميات (Pseudocode Debug)

### سؤال تصحيح 1 (logic): خطأ في تعريف ⟨T, P, E⟩

**الكود الخاطئ:**
```text
// Define Learning Task for Spam Filter
T = "Percentage of emails correctly classified"   // ERROR
P = "Categorize emails as spam or legitimate"     // ERROR
E = "Database of emails with human-given labels"  // CORRECT
```

**اكتشف الخطأ:**
T و P مُعكوسان. T هي المهمة وP هو مقياس الأداء.

**التصحيح:**
```text
// Define Learning Task for Spam Filter
T = "Categorize emails as spam or legitimate"        // Task
P = "Percentage of emails correctly classified"      // Performance Metric
E = "Database of emails with human-given labels"     // Experience
```

**شرح الحل:**
1. T = ما يجب أن يفعله النظام (تصنيف)
2. P = كيف نقيس نجاحه (النسبة المئوية)
3. E = ما يتعلم منه (قاعدة بيانات مُصنَّفة)

---

### سؤال تصحيح 2 (misconception): خلط بين Supervised و Unsupervised

**الكود الخاطئ:**
```text
// Cluster customers into groups
INPUT: customer_data with purchase_labels   // using labels!
ALGORITHM: K-Means Clustering
OUTPUT: Group assignments
```

**اكتشف الخطأ:**
`Clustering` هو `Unsupervised Learning` ولا يستخدم `purchase_labels`. استخدام Labels هنا يعني الانتقال لـ`Classification` وليس `Clustering`.

**التصحيح:**
```text
// Cluster customers into groups (Unsupervised)
INPUT: customer_data   // NO labels needed
ALGORITHM: K-Means Clustering
OUTPUT: Group assignments based on similarity
```

**شرح الحل:**
1. `Clustering` لا يحتاج تسميات — يكتشف البنية بنفسه
2. إذا أردنا استخدام labels، يجب تغيير الخوارزمية لـ`Supervised Classifier`
3. الفرق الجوهري: Unsupervised يكتشف، Supervised يتعلم من مثال

---

### سؤال تصحيح 3 (wrong_heuristic): خطأ في اختيار معيار التقييم

**الكود الخاطئ:**
```text
// Evaluate regression model predicting house prices
EVALUATE using: Accuracy   // ERROR - Accuracy for continuous output
if (predicted == actual):
    correct_count++
RESULT: Accuracy = correct_count / total
```

**اكتشف الخطأ:**
`Accuracy` معيار للتصنيف (outputs منفصلة). في `Regression`، المخرج قيمة حقيقية مستمرة؛ فرصة التطابق التام = 0.

**التصحيح:**
```text
// Evaluate regression model predicting house prices
EVALUATE using: Mean Squared Error (MSE)
FOR each prediction:
    error = (predicted - actual)^2
    total_error += error
MSE = total_error / N
```

**شرح الحل:**
1. `Regression` → استخدم `MSE`، `RMSE`، أو `MAE`
2. `Classification` → استخدم `Accuracy`، `Precision`، `Recall`
3. الخطأ الشائع: استخدام معيار Classification مع Regression

---

### سؤال تصحيح 4 (infinite_loop): حلقة لا نهائية في ML Pipeline

**الكود الخاطئ:**
```text
// ML Pipeline
WHILE model_not_perfect:
    collect_more_data()
    retrain_model()
    IF accuracy == 100%:
        BREAK
    ELSE:
        continue_loop()  // Always continues - never breaks!
```

**اكتشف الخطأ:**
الشرط `accuracy == 100%` مستحيل تحقيقه في الواقع — يُسبب حلقة لا نهائية. النماذج الواقعية لا تصل لدقة 100%.

**التصحيح:**
```text
// ML Pipeline
target_accuracy = 0.95   // define acceptable threshold
WHILE accuracy < target_accuracy AND iterations < max_iterations:
    collect_more_data()
    retrain_model()
    accuracy = evaluate_model()
    iterations++
// Deploy when threshold reached or max iterations exceeded
```

**شرح الحل:**
1. حدد عتبة قبول واقعية (`target_accuracy`)
2. أضف حداً أقصى للتكرارات (`max_iterations`)
3. تعلم الآلة في الممارسة يقبل بدقة كافية لا دقة مثالية

---

### سؤال تصحيح 5 (logic): خطأ في تعريف Policy في RL

**الكود الخاطئ:**
```text
// Reinforcement Learning Policy Definition
Policy = list_of_all_possible_actions   // ERROR
// Policy maps only actions, not states to actions
```

**اكتشف الخطأ:**
`Policy` ليست قائمة بالأفعال. `Policy` هي **دالة** تعيين من الحالات للأفعال: `π: S → A`.

**التصحيح:**
```text
// Reinforcement Learning - Correct Policy Definition
Policy π: States → Actions
// For each state s in State Space S:
//   π(s) = action a that the agent should take in state s
// Example: π(maze_cell_3) = "move_right"
//          π(maze_cell_7) = "move_up"
```

**شرح الحل:**
1. Policy = دالة من S إلى A (ليست قائمة بالأفعال فقط)
2. لكل حالة محددة، السياسة تُحدد الفعل الأمثل
3. هدف Reinforcement Learning هو إيجاد السياسة المثلى π*

---

### سؤال تصحيح 6 (misconception): خلط بين نوع التعلم والتطبيق

**الكود الخاطئ:**
```text
// Medical diagnosis system
// "We have no labeled data, so we must use Reinforcement Learning"
TYPE = ReinforcementLearning
// Using RL with delayed rewards based on treatment outcomes
```

**اكتشف الخطأ:**
بدون labels مُصنَّفة لا يعني استخدام `Reinforcement Learning`. `Unsupervised Learning` أو `Semi-supervised Learning` أنسب عندما نملك بيانات بدون تسميات طبية.

**التصحيح:**
```text
// Medical diagnosis system
// No labeled data → Use Unsupervised Learning for pattern discovery
TYPE = UnsupervisedLearning (Clustering)
// OR if some labeled examples exist:
TYPE = SemiSupervisedLearning
// Reinforcement is appropriate only when:
// - Agent interacts with environment
// - Gets delayed reward from treatment outcomes over time
```

**شرح الحل:**
1. غياب labels → Unsupervised (ليس RL بالضرورة)
2. RL للحالات التفاعلية مع بيئة ومكافآت متأخرة
3. Semi-supervised إذا توفرت بعض التسميات

---

## الجزء الرابع: تمارين تطبيقية

> هذه تمارين إضافية من إعداد الدليل

---

### تمرين 1 (fill_gaps): أكمل جدول ⟨T, P, E⟩

**المعطيات:** أربع مسائل تعلم، أكمل الفراغات:

| المسألة | T | P | E |
|---|---|---|---|
| لعب الشطرنج | _______ | نسبة الألعاب المكسوبة | _______ |
| التعرف على الكلام | تحويل الكلام لنص | _______ | تسجيلات صوتية مُصنَّفة |
| التنبؤ بالطقس | _______ | دقة التنبؤ بالدرجات | بيانات طقس تاريخية |
| فلترة البريد | تصنيف بريد مزعج | _______ | رسائل مُصنَّفة بشرياً |

**نموذج الحل:**

| المسألة | T | P | E |
|---|---|---|---|
| لعب الشطرنج | لعب مباريات شطرنج | نسبة الألعاب المكسوبة | مباريات تجريبية ضد نفسه أو لاعبين |
| التعرف على الكلام | تحويل الكلام لنص | نسبة الكلمات المُتعرَّف عليها بشكل صحيح | تسجيلات صوتية مُصنَّفة |
| التنبؤ بالطقس | التنبؤ بدرجة الحرارة والطقس | دقة التنبؤ بالدرجات | بيانات طقس تاريخية |
| فلترة البريد | تصنيف بريد مزعج | نسبة الرسائل المُصنَّفة صحيحاً | رسائل مُصنَّفة بشرياً |

---

### تمرين 2 (scenario): اختيار نوع التعلم

**المعطيات:** خمسة سيناريوهات، حدد نوع التعلم المناسب ومبرره:

1. بنك يريد كشف معاملات احتيالية. لديه 100,000 معاملة، 2,000 منها مُصنَّفة كاحتيال.
2. شركة موسيقى تريد تجميع أغانٍ متشابهة بدون تصنيف مسبق.
3. روبوت يتعلم المشي في بيئة غير معروفة.
4. طبيب يريد تصنيف صور أشعة X (مريض/سليم) من 50,000 صورة مُصنَّفة.
5. نظام توصية يريد اقتراح أفلام لمستخدم بناءً على تفاعلاته.

**نموذج الحل:**

| السيناريو | النوع المناسب | المبرر |
|---|---|---|
| 1 — كشف الاحتيال | `Semi-supervised` | بيانات كثيرة، قليل منها مُصنَّف |
| 2 — تجميع أغانٍ | `Unsupervised (Clustering)` | لا تسميات مسبقة |
| 3 — روبوت يمشي | `Reinforcement Learning` | تفاعل مع بيئة + مكافأة متأخرة |
| 4 — صور أشعة | `Supervised (Classification)` | بيانات كثيرة مُصنَّفة |
| 5 — توصية أفلام | `Supervised أو Semi-supervised` | يمكن اعتبار تقييمات المستخدم labels |

---

### تمرين 3 (code_fix): صحّح تعريف مكوّنات خوارزمية

**الكود الخاطئ:**
```text
Algorithm: Decision Tree for Classification

Representation: Gradient Descent     // WRONG
Optimization:   Decision Tree        // WRONG  
Evaluation:     Entropy (Info Gain)  // CORRECT
```

**المطلوب:** صحّح الـ Representation و Optimization

**نموذج الحل:**
```text
Algorithm: Decision Tree for Classification

Representation: Symbolic Tree Structure      // CORRECT
                (internal nodes = features, leaves = class labels)
Optimization:   Divide and Conquer           // CORRECT
                (split by maximum Information Gain / minimum Entropy)
Evaluation:     Entropy (Info Gain)          // CORRECT
```

**الشرح:** Decision Tree يُمثَّل كشجرة رمزية (Symbolic)، ويُبنى بـDivide and Conquer لا Gradient Descent.

---

### تمرين 4 (search_trace): تتبع ML Pipeline

**المعطيات:** شركة تريد بناء نظام تحليل مشاعر للتغريدات.

**المطلوب:** رتّب الخطوات التالية وفق ML Pipeline الصحيح:

أ) تدريب نموذج `Naive Bayes` على 80% من البيانات
ب) جمع 50,000 تغريدة
ج) تقييم النموذج على 20% المتبقية
د) تنظيف التغريدات وإزالة الرموز والتكرارات
هـ) تصنيف التغريدات يدوياً (إيجابي/سلبي/محايد)
و) نشر النموذج في تطبيق الويب
ز) فهم هدف الشركة ونوع المشاعر المطلوبة

**نموذج الحل:**
```text
الترتيب الصحيح:
ز → ب → هـ → د → أ → ج → و

1. ز: فهم الهدف (Understand Domain)
2. ب: جمع البيانات (Data Collection)
3. هـ: تصنيف يدوي (Labeling = Training Experience)
4. د: تنظيف البيانات (Preprocessing)
5. أ: تدريب النموذج (Learn Model)
6. ج: تقييم النموذج (Evaluate)
7. و: النشر (Deploy)
```

---

### تمرين 5 (logic_table): جدول تصنيف أنواع التعلم

**المطلوب:** أكمل الجدول — حدد نوع التعلم لكل خاصية:

| الخاصية | `Supervised` | `Unsupervised` | `Reinforcement` |
|---|---|---|---|
| يحتاج labels في التدريب | ✓ | | |
| مخرجه Policy | | | |
| يكتشف Clusters | | | |
| له Delayed Reward | | | |
| يستخدم Regression | | | |
| يستخدم Divide & Conquer | ؟ | ؟ | ؟ |

**نموذج الحل:**

| الخاصية | `Supervised` | `Unsupervised` | `Reinforcement` |
|---|---|---|---|
| يحتاج labels في التدريب | ✓ | ✗ | ✗ (reward فقط) |
| مخرجه Policy | ✗ | ✗ | ✓ |
| يكتشف Clusters | ✗ | ✓ | ✗ |
| له Delayed Reward | ✗ | ✗ | ✓ |
| يستخدم Regression | ✓ | ✗ | ✗ (عادةً) |
| يستخدم Divide & Conquer | ✓ (Decision Trees) | ✗ (عادةً) | ✗ (عادةً) |

---

### تمرين 6 (heuristic_eval): تقييم نموذج

**المعطيات:** نموذج Regression للتنبؤ بسعر السكن. القيم التالية:

| المنزل | السعر الفعلي ($) | السعر المتنبأ ($) |
|---|---|---|
| 1 | 200,000 | 210,000 |
| 2 | 350,000 | 320,000 |
| 3 | 150,000 | 155,000 |
| 4 | 500,000 | 480,000 |

**المطلوب:** احسب MSE (Mean Squared Error)

**نموذج الحل:**

$$
MSE = \frac{1}{N} \sum_{i=1}^{N} (y_i - \hat{y}_i)^2
$$

| المنزل | الخطأ | الخطأ المربع |
|---|---|---|
| 1 | 200,000 - 210,000 = -10,000 | 100,000,000 |
| 2 | 350,000 - 320,000 = 30,000 | 900,000,000 |
| 3 | 150,000 - 155,000 = -5,000 | 25,000,000 |
| 4 | 500,000 - 480,000 = 20,000 | 400,000,000 |

$$MSE = \frac{100M + 900M + 25M + 400M}{4} = \frac{1,425,000,000}{4} = 356,250,000$$

$$RMSE = \sqrt{356,250,000} \approx 18,875 \text{ دولار}$$

**التفسير:** متوسط خطأ التنبؤ ~$18,875 لكل منزل.

---

## الجزء الرابع: تمارين تحليل وتطبيق (إضافية — من إعداد الدليل)

---

### تمرين تحليل 1 (case_study): تحليل حالة دراسية

**الحالة:** شركة Netflix تريد نظاماً لتوصية الأفلام. لديها:
- 200 مليون مشترك
- 15,000 فيلم ومسلسل
- سجل مشاهدة كامل لكل مشترك
- تقييمات نجوم من بعض المشتركين (وليس كلهم)

**المطلوب:**
1. ما ⟨T, P, E⟩ لهذه المسألة؟
2. أي نوع تعلم مناسب؟ لماذا؟
3. ما التمثيل المناسب؟
4. ما أسلوب التقييم المناسب؟

**نموذج الحل:**

1. **⟨T, P, E⟩:**
   - T: اقتراح أفلام يُرجَّح أن المشترك يستمتع بها
   - P: نسبة الأفلام المقترحة التي يشاهدها المشترك فعلاً (Click-Through Rate)
   - E: سجل المشاهدة + التقييمات المتوفرة

2. **نوع التعلم:** `Collaborative Filtering` (نوع خاص من Supervised/Semi-supervised)
   - Supervised للمشتركين الذين لديهم تقييمات
   - Semi-supervised لأن معظم المشاهدات بدون تقييم صريح

3. **التمثيل:** `Matrix Factorization` أو `Neural Network` (Numerical)

4. **التقييم:** `RMSE` على التقييمات المعروفة + `Precision@K` للتوصيات

---

### تمرين تحليل 2 (table_fill): أكمل جدول مكونات الخوارزميات

**المطلوب:** أكمل الجدول:

| الخوارزمية | Representation | Optimization | Evaluation |
|---|---|---|---|
| `Decision Tree` | | | |
| `Neural Network` | | | |
| `K-Means Clustering` | | | |
| `Naive Bayes` | | | |

**نموذج الحل:**

| الخوارزمية | Representation | Optimization | Evaluation |
|---|---|---|---|
| `Decision Tree` | Symbolic Tree | Divide & Conquer (Info Gain) | Accuracy / Entropy |
| `Neural Network` | Numerical (Weighted Graph) | Gradient Descent (Backprop) | MSE / Cross-Entropy |
| `K-Means Clustering` | Cluster Centers (Centroids) | Iterative Assignment + Update | Within-cluster Sum of Squares |
| `Naive Bayes` | Probabilistic Graphical Model | Maximum Likelihood | Accuracy / Likelihood |

---

### تمرين تحليل 3 (diagram_completion): أكمل مخطط نظام التعلم

**المطلوب:** في مخطط نظام التعلم (Learning System Architecture)، ما الدور الذي يؤديه كل مكوّن في مسألة فلترة البريد؟

**نموذج الحل:**

| المكوّن | الدور في Spam Filter |
|---|---|
| Environment/Experience | قاعدة البيانات من 10,000 رسالة بريدية |
| Training data (arrow) | الـ 8,000 رسالة للتدريب (80%) |
| Learner | خوارزمية `Naive Bayes` أو `Decision Tree` |
| Knowledge (Model) | النموذج المُتعلَّم (أوزان/شجرة) |
| Testing data (arrow) | الـ 2,000 رسالة للاختبار (20%) |
| Performance Element | تصنيف رسائل جديدة كـ Spam/Not Spam |

---

### تمرين تحليل 4 (written_analysis): تحليل مقارن

**المطلوب:** اكتب تحليلاً مقارناً بين `Supervised` و `Reinforcement Learning` في سياق تدريب روبوت للعب الشطرنج.

**نموذج الحل:**

| المعيار | `Supervised` | `Reinforcement` |
|---|---|---|
| البيانات المطلوبة | ملايين أمثلة من حركات خبراء مُصنَّفة | فقط قواعد اللعبة |
| كيف يتعلم؟ | يُقلّد الخبير (imitation learning) | يُجرّب ويتعلم من النتائج |
| جودة التعلم | محدود بجودة الخبير | يمكن تجاوز مستوى الخبير |
| التعقيد | أبسط في التنفيذ | أعقد (credit assignment) |
| مثال | تعلم من قواعد بيانات بطولات | AlphaGo: يلعب ملايين مباريات ضد نفسه |

**الاستنتاج:** `Reinforcement Learning` أقوى لألعاب الاستراتيجية لأنه يمكنه تجاوز مستوى البشر، لكن `Supervised` أسرع للبدء إذا توفرت بيانات خبراء.

---

## الجزء الرابع: تمارين تتبع الخوارزميات (خطوة بخطوة)

---

### تمرين تتبع 1: تتبع ML Pipeline خطوة بخطوة

**المعطيات:** نريد بناء نموذج للتنبؤ بنجاح طالب (ناجح/راسب) بناءً على ساعات الدراسة والحضور.

**أكمل الجدول:**

| الخطوة | العملية | الناتج |
|---|---|---|
| 1 | تحديد المهمة | ؟ |
| 2 | جمع البيانات | ؟ |
| 3 | اختيار نوع التعلم | ؟ |
| 4 | اختيار التمثيل | ؟ |
| 5 | التدريب | ؟ |
| 6 | التقييم | ؟ |

**نموذج الحل:**

| الخطوة | العملية | الناتج |
|---|---|---|
| 1 | تحديد المهمة | T=تصنيف ناجح/راسب، P=Accuracy، E=سجلات طلاب سابقة |
| 2 | جمع البيانات | 500 سجل طالب: (ساعات دراسة، حضور، نتيجة) |
| 3 | اختيار نوع التعلم | Supervised Classification (لدينا labels) |
| 4 | اختيار التمثيل | Decision Tree أو Logistic Regression |
| 5 | التدريب | تشغيل الخوارزمية على 400 سجل (80%) |
| 6 | التقييم | Accuracy على 100 سجل (20%): مثلاً 88% |

**النتيجة:** نموذج يتنبأ بنجاح/رسوب طالب بدقة 88%

---

### تمرين تتبع 2: تتبع Unsupervised Clustering

**المعطيات:** 6 نقاط بيانات، نريد تجميعها في مجموعتين بـK-Means (k=2). المراكز الابتدائية: C1=(1,1), C2=(5,5)

نقاط: A(1,2), B(2,1), C(1.5,1.5), D(5,4), E(6,5), F(4,6)

**أكمل الجدول (التكرار الأول):**

| النقطة | المسافة لـC1 | المسافة لـC2 | المجموعة |
|---|---|---|---|
| A(1,2) | ؟ | ؟ | ؟ |
| B(2,1) | ؟ | ؟ | ؟ |
| C(1.5,1.5) | ؟ | ؟ | ؟ |
| D(5,4) | ؟ | ؟ | ؟ |
| E(6,5) | ؟ | ؟ | ؟ |
| F(4,6) | ؟ | ؟ | ؟ |

**نموذج الحل:**

$$d(P, Q) = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$$

| النقطة | المسافة لـC1(1,1) | المسافة لـC2(5,5) | المجموعة |
|---|---|---|---|
| A(1,2) | √(0+1)=1.0 | √(16+9)=5.0 | **G1** |
| B(2,1) | √(1+0)=1.0 | √(9+16)=5.0 | **G1** |
| C(1.5,1.5) | √(.25+.25)=0.7 | √(12.25+12.25)=4.9 | **G1** |
| D(5,4) | √(16+9)=5.0 | √(0+1)=1.0 | **G2** |
| E(6,5) | √(25+16)=6.4 | √(1+0)=1.0 | **G2** |
| F(4,6) | √(9+25)=5.8 | √(1+1)=1.4 | **G2** |

**النتيجة:** G1 = {A, B, C} | G2 = {D, E, F}

---

### تمرين تتبع 3: تتبع تطبيق ⟨T, P, E⟩

**المعطيات:** خمسة سيناريوهات، حدد إذا كانت مهمة تعلم صحيحة أم لا:

| السيناريو | T | P | E | صحيح؟ |
|---|---|---|---|---|
| 1 | قيادة سيارة | عدد الحوادث | لا شيء | ؟ |
| 2 | تصنيف بريد | نسبة التصنيف | رسائل مُصنَّفة | ؟ |
| 3 | لعب شطرنج | نسبة الفوز | مباريات ضد النفس | ؟ |
| 4 | حساب 2+2 | دقة 100% | لا شيء | ؟ |
| 5 | تشخيص طبي | نسبة التشخيص | صور أشعة X مُصنَّفة | ؟ |

**نموذج الحل:**

| السيناريو | صحيح؟ | السبب |
|---|---|---|
| 1 | ❌ | E = لا شيء؛ لا يمكن التعلم بدون تجربة |
| 2 | ✅ | ⟨T, P, E⟩ مكتمل وواضح |
| 3 | ✅ | مثال من المحاضرة (Checkers يلعب ضد نفسه) |
| 4 | ❌ | لا تحتاج تعلماً — قاعدة رياضية ثابتة |
| 5 | ✅ | ⟨T, P, E⟩ مكتمل |

---

### تمرين تتبع 4: تتبع Reinforcement Learning

**المعطيات:** روبوت في متاهة 3×3. الحالات S1..S9. الفعل الحالي: RIGHT. المكافأة عند الوصول لـS9: +100. عقوبة لكل خطوة: -1.

**أكمل جدول التفاعل (3 خطوات):**

| الخطوة | الحالة | الفعل | المكافأة | الحالة التالية |
|---|---|---|---|---|
| 1 | S1 | RIGHT | ؟ | ؟ |
| 2 | S2 | DOWN | ؟ | ؟ |
| 3 | S5 | DOWN | ؟ | ؟ |

**نموذج الحل:**

```text
المتاهة:
S1 S2 S3
S4 S5 S6
S7 S8 S9(هدف)
```

| الخطوة | الحالة | الفعل | المكافأة | الحالة التالية |
|---|---|---|---|---|
| 1 | S1 | RIGHT | -1 (عقوبة خطوة) | S2 |
| 2 | S2 | DOWN | -1 | S5 |
| 3 | S5 | DOWN | -1 | S8 |

**النتيجة:** بعد 3 خطوات، تراكم المكافأة = -3 (لم يصل للهدف بعد)
خطوة واحدة إضافية (S8 → RIGHT → S9) ستُعطي مكافأة +100 - 1 = +99

---

## الجزء الرابع: أسئلة تصميم

---

### سؤال تصميم 1 (architecture): صمّم نظام تعلم آلة

**المطلوب:** صمّم نظام `Supervised Learning` لتصنيف صور طبية (ورم خبيث/حميد). حدد:
1. ⟨T, P, E⟩
2. نوع التعلم
3. التمثيل المناسب
4. خوارزمية التحسين
5. معيار التقييم
6. مخطط النظام الكامل

**نموذج الإجابة:**

1. **⟨T, P, E⟩:**
   - T: تصنيف صورة أشعة MRI كـ (ورم خبيث / حميد)
   - P: دقة التصنيف + Recall للورم الخبيث (حساسية عالية ضرورية)
   - E: 100,000 صورة مُصنَّفة من أطباء أشعة متخصصين

2. **نوع التعلم:** `Supervised Classification`

3. **التمثيل:** `Deep Neural Network` (Convolutional Neural Network - CNN)

4. **التحسين:** `Gradient Descent` مع `Backpropagation`

5. **التقييم:** `Recall` (حساسية) أولاً ثم `Precision` — في التشخيص الطبي، إفلات حالة خبيثة أخطر من تشخيص حميد كخبيث

6. **مخطط النظام:**
```text
[صور MRI خام] → [معالجة وتطبيع] → [CNN للتدريب] → [نموذج مُتعلَّم]
                                                              ↓
[صورة جديدة] → [معالجة] → [تطبيق النموذج] → [تصنيف + نسبة ثقة]
```

**معايير التقييم:**
- وضوح تعريف ⟨T, P, E⟩
- مناسبة الـ Representation للمسألة (CNN للصور)
- اختيار معيار تقييم مناسب للسياق الطبي
- مراعاة تكلفة أنواع الأخطاء المختلفة

---

### سؤال تصميم 2 (uml_design): صمّم مخطط Learning System

**المطلوب:** ارسم/صف مخطط `Reinforcement Learning` لروبوت يتعلم تجنب العقبات. حدد كل مكوّن.

**نموذج الإجابة:**

```diagram
type: flowchart
title: RL Robot Obstacle Avoidance
direction: TD
nodes:
  - id: env
    label: Environment (Room with obstacles)
    kind: data
    level: 0
  - id: state
    label: State (Robot position + sensor readings)
    kind: process
    level: 1
  - id: agent
    label: Agent (RL Algorithm)
    kind: process
    level: 2
  - id: action
    label: Action (Move: forward/left/right/back)
    kind: process
    level: 3
  - id: reward
    label: Reward (+10 goal, -5 collision, -1 step)
    kind: data
    level: 3
  - id: policy
    label: Policy π: State → Action
    kind: store
    level: 2
edges:
  - from: env
    to: state
    label: observe
  - from: state
    to: agent
    label: input
  - from: agent
    to: action
    label: execute
  - from: action
    to: env
    label: effect
  - from: env
    to: reward
    label: feedback
  - from: reward
    to: agent
    label: update
  - from: agent
    to: policy
    label: learns
```

**معايير التقييم:**
- وجود حلقة State→Action→Reward→Update
- تحديد Delayed Reward بوضوح
- توضيح كيف تتحسن الـ Policy مع الوقت

---

## الجزء الرابع: بطاقات سؤال وجواب (Q&A Cards)

**Q1:** ما تعريف Mitchell لتعلم الآلة؟
**A:** خوارزمية تُحسّن أداءها P على مهمة T من خلال تجربة E. المهمة المحددة تكتب كـ ⟨T, P, E⟩.

---

**Q2:** ما الفرق الجوهري بين البرمجة التقليدية وتعلم الآلة؟
**A:** البرمجة التقليدية: Data + Program → Output. تعلم الآلة: Data + Output → Program (النموذج يُستخلص من البيانات).

---

**Q3:** متى نستخدم Supervised Learning؟
**A:** عندما تتوفر بيانات مُصنَّفة (labels) وهدفنا تعلم دالة تنبؤية.

---

**Q4:** ما الفرق بين Regression و Classification في Supervised Learning؟
**A:** Regression: مخرج قيمة حقيقية مستمرة (سعر سيارة). Classification: مخرج فئة منفصلة (مريض/سليم).

---

**Q5:** ما Unsupervised Learning ومتى نستخدمه؟
**A:** تعلم بدون labels — يكتشف بنية خفية في البيانات. نستخدمه للـ Clustering واختزال الأبعاد.

---

**Q6:** ما هو Policy في Reinforcement Learning؟
**A:** دالة تعيين π: S → A تُحدد الفعل الأمثل لكل حالة. هدف RL هو إيجاد السياسة المثلى π*.

---

**Q7:** ما مشكلة Credit Assignment؟
**A:** تحديد أي الأفعال في تسلسل طويل كانت مسؤولة عن النتيجة النهائية (الفوز أو الخسارة).

---

**Q8:** ما المكونات الثلاثة لأي خوارزمية تعلم؟
**A:** Representation (تمثيل النموذج) + Optimization (تحسينه) + Evaluation (تقييمه).

---

**Q9:** أعطِ مثالاً على Symbolic Function Representation.
**A:** Decision Tree — شجرة قرار تُمثَّل كعقد قرار وأوراق فئات، قابلة للقراءة البشرية.

---

**Q10:** ما الفرق بين Gradient Descent و Divide and Conquer كأسلوب تحسين؟
**A:** Gradient Descent: يتبع اتجاه الانحدار في فضاء الأوزان المستمر. Divide and Conquer: يُقسّم المسألة لمسائل فرعية (مثل بناء Decision Tree).

---

**Q11:** ما Semi-supervised Learning؟
**A:** تعلم من بيانات معظمها غير مُصنَّف مع عينة مُصنَّفة صغيرة — يجمع مزايا Supervised و Unsupervised.

---

**Q12:** لماذا لا نستخدم ML لحساب الراتب؟
**A:** لأن القاعدة الرياضية ثابتة ومعروفة — لا يوجد ما يُتعلَّم، البرمجة التقليدية كافية.

---

**Q13:** ما Hypothesis Space؟
**A:** مجموعة كل النماذج الممكنة التي تُمثّل الحلول المحتملة؛ خوارزمية التعلم تبحث فيها عن الأفضل.

---

**Q14:** ما الفرق بين Instance-based و Numerical Representations؟
**A:** Instance-based (مثل K-NN): يُخزّن البيانات الأصلية ويُصنَّف بالتشابه. Numerical: يبني نموذجاً رياضياً صريحاً (أوزان).

---

**Q15:** ما معيار التقييم المناسب للـ Regression؟
**A:** MSE (Mean Squared Error) أو RMSE أو MAE — وليس Accuracy (الذي للـ Classification).

---

**Q16:** اذكر أربعة تطبيقات لتعلم الآلة من المحاضرة.
**A:** Web Search، Computational Biology، Finance (fraud detection)، Robotics، Space Exploration، Social Networks.

---

**Q17:** ما Delayed Reward في RL وما تحديه؟
**A:** المكافأة لا تأتي فوراً بل بعد سلسلة من الأفعال — التحدي هو معرفة أي الأفعال الماضية تسببت في النتيجة (Credit Assignment).

---

**Q18:** لماذا تصنيف الأرقام المكتوبة بخط اليد يحتاج ML؟
**A:** لأن الرقم نفسه (مثل "2") له أشكال لا محدودة من شخص لآخر؛ يستحيل كتابة قواعد يدوية تغطي كل الأشكال.

---

**Q19:** ما الخطوة الأولى في ML Pipeline؟
**A:** فهم المجال والأهداف (Domain Understanding) — قبل أي جمع بيانات أو تدريب نموذج.

---

**Q20:** ما Inductive Bias؟
**A:** الافتراض المسبق الذي تفرضه الخوارزمية على شكل الحل؛ مثلاً Decision Tree يفترض الحل بحدود محورية (axis-aligned boundaries).

---

## الجزء الخامس: الخوارزميات الكاملة (مرجع Pseudocode)

> مرجع pseudocode كامل — بدون شرح جديد. كل خوارزمية في كتلة مستقلة.

```text
// Supervised Learning General Pipeline
FUNCTION SupervisedLearning(training_data, algorithm):
    // training_data = {(x_1, y_1), (x_2, y_2), ..., (x_n, y_n)}
    model = algorithm.train(training_data)   // Learn f: X → Y
    RETURN model

FUNCTION Predict(model, new_x):
    RETURN model.apply(new_x)   // Apply learned function
```

---

```text
// Unsupervised Learning: K-Means Clustering
FUNCTION KMeans(data, k):
    // Initialize k random centroids
    centroids = random_sample(data, k)
    
    REPEAT:
        // Assign each point to nearest centroid
        FOR each point p in data:
            cluster[p] = argmin_c distance(p, centroids[c])
        
        // Update centroids
        FOR each cluster c:
            centroids[c] = mean(all points in cluster c)
    
    UNTIL centroids do not change (convergence)
    RETURN cluster_assignments
```

---

```text
// Reinforcement Learning: General Loop
FUNCTION RLTrainingLoop(environment, agent):
    policy = initialize_random_policy()
    
    REPEAT until policy converges:
        state = environment.initial_state()
        
        WHILE state is not terminal:
            action = policy(state)              // Choose action from policy
            next_state, reward = environment.step(action)  // Execute action
            agent.update(state, action, reward, next_state)  // Learn from reward
            state = next_state
        
        policy = agent.improved_policy()       // Update policy
    
    RETURN policy
```

---

```text
// ML Algorithm Components Template
ALGORITHM: {Name}

REPRESENTATION:
    model = {data_structure}   // How the solution is encoded

OPTIMIZATION:
    FUNCTION train(training_data):
        // Search through hypothesis space
        FOR each hypothesis h in HypothesisSpace:
            evaluate h on training_data
        RETURN best_h according to Evaluation criterion

EVALUATION:
    FUNCTION evaluate(model, test_data):
        score = compute_metric(model, test_data)
        // metric: Accuracy / MSE / Entropy / Likelihood / etc.
        RETURN score
```

---

```text
// Gradient Descent Optimization (for Numerical Models)
FUNCTION GradientDescent(model, training_data, learning_rate, max_iter):
    theta = initialize_parameters()     // Initialize model weights
    
    FOR i = 1 to max_iter:
        gradient = compute_gradient(theta, training_data)  // ∇J(θ)
        theta = theta - learning_rate * gradient            // Update step
        
        IF gradient is approximately zero:
            BREAK   // Convergence reached
    
    RETURN theta   // Optimized parameters
```

---

```text
// Decision Tree Induction (Divide and Conquer)
FUNCTION BuildDecisionTree(data, features):
    IF all data same class:
        RETURN Leaf(class)   // Base case
    
    IF no features left:
        RETURN Leaf(majority_class(data))   // Base case
    
    best_feature = argmax Information_Gain(data, feature)  // Select split
    tree = Node(best_feature)
    
    FOR each value v of best_feature:
        subset = data where feature = v
        child = BuildDecisionTree(subset, features - {best_feature})
        tree.add_child(v, child)
    
    RETURN tree
```

---

## الجزء الخامس: أسئلة نظرية متوقعة بالامتحان

---

### السؤال 1: اشرح تعريف Mitchell لتعلم الآلة وطبّقه على مثال.

**نموذج الإجابة:**
1. **التعريف:** خوارزمية تعلم الآلة تُحسّن أداءها P على مهمة T من خلال تجربة E.
2. **المكونات:** T = ما يفعله النظام | P = كيف نقيسه | E = ما يتعلم منه
3. **مثال:** كشف البريد المزعج: T=تصنيف بريد | P=نسبة التصنيف الصحيح | E=قاعدة رسائل مُصنَّفة
4. **متى نستخدم:** عندما يصعب برمجة القواعد يدوياً أو البيانات ضخمة جداً

---

### السؤال 2: قارن بين الأنواع الأربعة لتعلم الآلة.

**نموذج الإجابة:**
1. **التعريفات:** Supervised (بيانات+labels) | Unsupervised (بيانات فقط) | Semi-supervised (labels قليلة) | Reinforcement (مكافآت)
2. **المكونات:** جدول المقارنة (labels، مخرج، مثال)
3. **مثال:** Spam(Sup) | Clustering(Unsup) | Robot(RL)
4. **متى نستخدم:** حسب توفر labels وطبيعة المسألة

---

### السؤال 3: ما المكونات الثلاثة لأي خوارزمية تعلم؟ أعطِ مثالاً كاملاً.

**نموذج الإجابة:**
1. **التعريف:** Representation + Optimization + Evaluation
2. **المكونات:** كل مكوّن له أدوار محددة
3. **مثال (Decision Tree):** Rep=شجرة رمزية | Opt=Divide&Conquer | Eval=Entropy/Accuracy
4. **متى نستخدم:** الإطار ينطبق على أي خوارزمية تعلم بدون استثناء

---

### السؤال 4: متى نستخدم ML ومتى لا نستخدمه؟

**نموذج الإجابة:**
1. **نستخدم ML:** الخبرة غير موجودة | الخبرة موجودة لكن لا تُشرح | النماذج تحتاج تخصيص | البيانات ضخمة
2. **لا نستخدم:** القواعد ثابتة ومعروفة (حساب راتب، معادلات رياضية بسيطة)
3. **مثال للاستخدام:** التعرف على الكلام
4. **مثال لعدم الاستخدام:** حساب مساحة دائرة

---

### السؤال 5: اشرح ML Pipeline كاملاً.

**نموذج الإجابة:**
1. **التعريف:** عملية تكرارية من 5 خطوات
2. **الخطوات:** فهم المجال → جمع وتنظيف البيانات → تعلم النماذج → تفسير النتائج → نشر المعرفة
3. **مثال:** تطبيق على مسألة تحليل مشاعر
4. **متى نكرر:** كلما كانت النتائج غير مُرضية نعود لخطوة أسبق

---

### السؤال 6: ما Hypothesis Space وما علاقته بأنواع التمثيل؟

**نموذج الإجابة:**
1. **التعريف:** مجموعة كل النماذج الممكنة التي تبحث فيها الخوارزمية
2. **المكونات:** كل تمثيل يُحدد Hypothesis Space مختلف
3. **مثال:** Decision Tree HSpace = كل الأشجار الممكنة | Linear Model HSpace = كل الخطوط الممكنة
4. **متى نستخدم:** اختيار التمثيل = اختيار HSpace

---

### السؤال 7: ما Reinforcement Learning وما مميزاته ومحدوديته؟

**نموذج الإجابة:**
1. **التعريف:** تعلم من تسلسل حالات وأفعال بمكافآت متأخرة لإيجاد Policy مثلى
2. **المكونات:** State، Action، Reward، Policy
3. **مثال:** Robot in a maze، Game Playing
4. **متى نستخدم:** التفاعل مع بيئة ديناميكية حيث لا توجد بيانات مُصنَّفة مسبقاً

---

### السؤال 8: ما التسلسل الهرمي لتعلم الآلة العميق في مثال صور الوجوه؟

**نموذج الإجابة:**
1. **التعريف:** Deep Learning يتعلم تمثيلات هرمية متعددة المستويات
2. **المكونات:** Pixels → Edges → Object Parts → Object Models
3. **مثال:** Deep Belief Net على صور الوجوه
4. **متى نستخدم:** البيانات المعقدة (صور، كلام، نص) التي تحتاج تمثيلات تجريدية عالية

---

### السؤال 9: قارن بين الفرق الرئيسي بين Symbolic و Numerical Representations.

**نموذج الإجابة:**
1. **التعريف:** Symbolic: قواعد قابلة للقراءة (Decision Trees) | Numerical: دوال رياضية (Neural Networks)
2. **المكونات:** قابلية التفسير vs الدقة والمرونة
3. **مثال:** Decision Tree (Symbolic) vs Neural Network (Numerical)
4. **متى نستخدم:** Symbolic عندما التفسير ضروري (طب، قانون) | Numerical عندما الدقة أولوية

---

### السؤال 10: اشرح مفهوم Policy في RL وكيف تُحسَّن.

**نموذج الإجابة:**
1. **التعريف:** Policy π: S → A دالة تعيين من الحالات للأفعال
2. **المكونات:** State Space، Action Space، Reward Signal
3. **مثال:** Robot: π(cell_3) = move_right
4. **متى نستخدم:** كلما احتجنا لاتخاذ قرارات متسلسلة في بيئة تفاعلية

---

## الجزء السادس: قائمة فحص ذاتي قبل الامتحان ✅

- [ ] أستطيع تعريف Machine Learning بتعريف Mitchell وأضرب مثالاً كاملاً بـ ⟨T, P, E⟩
- [ ] أفهم الفرق بين البرمجة التقليدية وتعلم الآلة بالمخطط
- [ ] أعرف متى نستخدم ML ومتى لا نستخدمه مع أمثلة
- [ ] أستطيع تصنيف أي مسألة كـ Supervised / Unsupervised / Semi-supervised / Reinforcement
- [ ] أفهم الفرق بين Regression و Classification في Supervised Learning
- [ ] أعرف مفهوم Policy في Reinforcement Learning وأكتبه كمعادلة
- [ ] أفهم مشكلة Credit Assignment وأشرحها
- [ ] أعرف المكونات الثلاثة لأي خوارزمية: Representation + Optimization + Evaluation
- [ ] أستطيع ذكر مثال على كل فئة من Function Representations
- [ ] أعرف الفرق بين Gradient Descent و Divide and Conquer
- [ ] أعرف معايير التقييم المناسبة لـ Regression (MSE) مقابل Classification (Accuracy)
- [ ] أفهم ML Pipeline وأرتّب خطواته
- [ ] أفهم مفهوم Hypothesis Space وعلاقته بالتمثيل
- [ ] أستطيع رسم/وصف مخطط Learning System Architecture
- [ ] أعرف التسلسل الهرمي في Deep Learning: Pixels→Edges→Parts→Models
- [ ] أستطيع حساب MSE لمسألة Regression بسيطة
- [ ] أعرف تطبيقات ML الرئيسية المذكورة في المحاضرة

---

## الجزء السادس: ورقة المراجعة السريعة (Cheat Sheet)

### 🔑 خريطة العلاقات بين المحاضرات

| المحاضرة | ترتبط مع | كيف؟ |
|---|---|---|
| Introduction to AI | Machine Learning | ML جزء من AI |
| Search Algorithms | ML Optimization | Gradient Descent هو نوع من البحث في فضاء الأوزان |
| Logical Agents | ML Symbolic | Decision Trees وRule Learning تعتمد على المنطق |
| Machine Learning (هذه) | Linear Regression + Rule Learning | تُطبّق المفاهيم بخوارزميات محددة |

---

### 🔑 أهم النقاط الذهبية

| الموضوع | النقطة الذهبية |
|---|---|
| تعريف ML | ⟨T, P, E⟩ = المهمة + مقياس الأداء + التجربة |
| أنواع التعلم | Supervised(labels) → Unsupervised(no labels) → RL(reward) |
| مكونات الخوارزمية | Representation + Optimization + Evaluation |
| متى نستخدم ML | عندما القواعد غير محددة أو البيانات ضخمة |
| Regression vs Classification | مخرج حقيقي vs مخرج فئة |
| Policy | π: S → A (ليست قائمة أفعال!) |

---

### 🔑 مرجع سريع

| الرمز/المصطلح | المعنى | يُستخدم في |
|---|---|---|
| T | Task (المهمة) | تعريف مسألة التعلم |
| P | Performance (الأداء) | قياس جودة النظام |
| E | Experience (التجربة) | مصدر التعلم |
| π | Policy | Reinforcement Learning |
| π: S → A | Policy mapping | RL |
| MSE | Mean Squared Error | تقييم Regression |
| Accuracy | نسبة الصواب | تقييم Classification |
| Clustering | تجميع بدون labels | Unsupervised Learning |
| Backprop | Backpropagation | تدريب Neural Networks |

---

### 🔑 قواعد ذهبية لا تُنسى

| # | القاعدة |
|---|---|
| 1 | كل مسألة تعلم = ⟨T, P, E⟩ — إذا لم يكتمل الثلاثي، المسألة غير محددة |
| 2 | ML للمهام التي يصعب برمجة قواعدها يدوياً |
| 3 | Supervised يحتاج labels؛ Unsupervised يكتشف بدونها |
| 4 | كل خوارزمية = Representation + Optimization + Evaluation |
| 5 | Policy في RL = دالة من S إلى A (ليست قائمة!) |
| 6 | MSE للـ Regression؛ Accuracy للـ Classification |
| 7 | ML Pipeline تكرارية وليست خطية |
| 8 | Deep Learning: Pixels → Edges → Parts → Models |
| 9 | Hypothesis Space يختلف باختلاف التمثيل |
| 10 | Credit Assignment: تحديد مسؤولية الأفعال عن النتيجة |
