# المحاضرة 3 — Problem Solving and Search (حل المسائل والبحث)
> **المادة:** الذكاء الاصطناعي (القسم النظري) | **الموضوع:** حل المسائل بالبحث في فضاء الحالات

---

## 📌 خريطة التكامل (أين تقع هذه المحاضرة في الدورة؟)

| المرحلة | الأدوات | المخرجات |
| --- | --- | --- |
| المقدمة | `Rational Agent`، `Turing Test`، `PEAS` | فهم ماهية الذكاء الاصطناعي |
| الوكلاء الأذكياء | `Agent Function`، `Environment Types`، `Rationality` | تصميم الوكيل |
| **حل المسائل والبحث ← أنت هنا** | `BFS`، `DFS`، `UCS`، `IDS`، `A*`، `Greedy` | إيجاد الحل الأمثل في فضاء الحالات |
| البحث الهيوريستي | `A*`، `Greedy Best-First`، `Admissible Heuristic` | تسريع البحث بمعرفة إضافية |
| التعلم الآلي | `Supervised`، `Unsupervised`، `Reinforcement` | بناء نماذج من البيانات |

> **نوع هذه المحاضرة:** خوارزميات بحث — تُركّز على البنى النظرية (`State Space`، `Search Tree`)، الـ `pseudocode`، ومقارنات الخوارزميات بالجداول والمعادلات.

---

## الجزء الأول: الشرح التفصيلي (سطر بسطر)

---

### 1. Problem-Solving Agents (وكلاء حل المسائل)

#### النص الأصلي يقول:
> "Restricted form of general agent. This is offline problem solving; solution executed 'eyes closed.' Online problem solving involves acting without complete knowledge."

#### الشرح المبسّط:
`Problem-Solving Agent` هو نوع مقيّد من الوكيل العام. فكرة العمل **offline** تعني أن الوكيل يرسم خطة كاملة **قبل** أن يبدأ بالتنفيذ، تماماً كشخص يخطط لرحلة ويكتب قائمة بكل الخطوات قبل أن يغادر البيت.

**لماذا؟** لأنه في البيئات الكاملة المعرفة (`fully observable`، `deterministic`، `static`) يمكن حساب المسار كاملاً مسبقاً دون الحاجة لإعادة التخطيط أثناء التنفيذ.

#### 💡 التشبيه:
> تخيّل قائداً يبرمج مسار الملاحة (GPS) قبل القيادة — ينفّذ المسار "بعيون مغلقة" دون أن يفكر في كل خطوة.
> **وجه الشبه:** البرمجة المسبقة = `offline planning` | تنفيذ المسار = `solution execution`.

**الفهم الخاطئ الشائع ❌:** الوكيل يفكر أثناء التنفيذ ويعيد التخطيط.
**الفهم الصحيح ✅:** الوكيل ينفّذ الخطة كما هي دون تعديل (`eyes closed`).

---

#### 💻 الكود: Simple Problem-Solving Agent

#### ما هذا الكود؟
> يمثّل دورة عمل الوكيل: استقبال `percept` → تحديث الحالة → صياغة الهدف → البحث → تنفيذ الإجراء.

```text
// Simple Problem-Solving Agent — receives a percept, returns an action
function SIMPLE-PROBLEM-SOLVING-AGENT(percept) returns an action
  static: seq       // action sequence, initially empty
          state     // current world state description
          goal      // a goal, initially null
          problem   // a problem formulation

  state ← UPDATE-STATE(state, percept)  // update state with new perception
  if seq is empty then                   // if no plan exists
    goal    ← FORMULATE-GOAL(state)      // define what we want to achieve
    problem ← FORMULATE-PROBLEM(state, goal)  // build the search problem
    seq     ← SEARCH(problem)            // find solution sequence
  action ← RECOMMENDATION(seq, state)   // pick next action from sequence
  seq    ← REMAINDER(seq, state)         // remove executed action
  return action                          // execute the action
```

#### شرح كل سطر:
1. `static: seq` → تخزين تسلسل الإجراءات المخطط مسبقاً — يبقى بين الاستدعاءات.
2. `state ← UPDATE-STATE(state, percept)` → تحديث فهم الوكيل للعالم بناءً على الإدراك الجديد.
3. `if seq is empty` → إذا انتهت الخطة الحالية، نبدأ من جديد بصياغة هدف.
4. `FORMULATE-GOAL(state)` → ما الذي نريد تحقيقه؟ (مثال: الوصول إلى Bucharest).
5. `FORMULATE-PROBLEM(state, goal)` → بناء المسألة رسمياً (حالات + إجراءات + تكلفة).
6. `SEARCH(problem)` → تشغيل خوارزمية البحث للعثور على تسلسل إجراءات.
7. `RECOMMENDATION(seq, state)` → اختيار الإجراء التالي من الخطة.
8. `REMAINDER(seq, state)` → حذف الإجراء المنجز من القائمة.

**الناتج المتوقع:**
> في كل استدعاء: إجراء واحد (مثل `drive to Zerind`). لو `seq` فارغة يُعيد البحث من جديد.

---

### 2. Example: Romania (المثال التطبيقي — رومانيا)

#### النص الأصلي يقول:
> "On holiday in Romania; currently in Arad. Flight leaves tomorrow from Bucharest. Formulate goal: be in Bucharest. Formulate problem: states: various cities, actions: drive between cities. Find solution: sequence of cities, e.g., Arad, Sibiu, Fagaras, Bucharest."

#### الشرح المبسّط:
هذا المثال يوضّح كيف نُحوّل مشكلة حقيقية إلى مسألة بحث رسمية:

| عنصر المسألة | القيمة |
| --- | --- |
| `Initial State` | Arad |
| `Goal State` | Bucharest |
| `States` | مدن رومانيا |
| `Actions` | القيادة بين مدينتين متجاورتين |
| `Path Cost` | مسافة الطريق بالكيلومتر |
| `Solution` | Arad → Sibiu → Fagaras → Bucharest |

**لماذا؟** لأن الخريطة الجغرافية تُمثَّل كـ `State Space Graph` حيث العُقد = مدن والحواف = طرق بأوزان (مسافات).

#### 💡 التشبيه:
> كأنك تستخدم Google Maps: تدخل نقطة البداية والنهاية، ويحسب لك المسار الأقصر.
> **وجه الشبه:** الخريطة = `State Space Graph` | حساب المسار = `Search Algorithm`.

---

### 3. Single-State Problem Formulation (صياغة المسألة أحادية الحالة)

#### النص الأصلي يقول:
> "A problem is defined by four items: initial state, successor function S(x) = set of action–state pairs, goal test, path cost (additive). A solution is a sequence of actions leading from the initial state to a goal state."

#### الشرح المبسّط:
كل مسألة بحث تُبنى من **أربعة عناصر** أساسية:

| العنصر | التعريف | مثال رومانيا |
| --- | --- | --- |
| `Initial State` | الحالة التي يبدأ منها الوكيل | "at Arad" |
| `Successor Function` $S(x)$ | مجموعة الأزواج (إجراء، حالة) الممكنة | $S(\text{Arad}) = \{(\text{Arad→Zerind}, \text{Zerind}), ...\}$ |
| `Goal Test` | اختبار هل وصلنا للهدف؟ (صريح أو ضمني) | $x = \text{"at Bucharest"}$ أو $NoDirt(x)$ |
| `Path Cost` | تكلفة تراكمية للمسار (يُفترض $\geq 0$) | مجموع المسافات |

#### 📐 المعادلة: دالة التكلفة

$$
c(x, a, y) \geq 0
$$

**الشرح:**
> - $c$ = تكلفة الخطوة (`step cost`)
> - $x$ = الحالة الحالية
> - $a$ = الإجراء المنفَّذ
> - $y$ = الحالة الناتجة
> - التكلفة تراكمية: `path cost` = مجموع كل $c$ على طول المسار.

#### ملاحظة:
> `goal test` يمكن أن يكون **صريحاً** (مثل $x = \text{"Bucharest"}$) أو **ضمنياً** (مثل $NoDirt(x)$ في مثال المكنسة).

---

### 4. Example: Vacuum World State Space Graph (مثال فضاء حالات عالم المكنسة)

#### النص الأصلي يقول:
> "states: integer dirt and robot locations (ignore dirt amounts etc.). actions: Left, Right, Suck, NoOp. goal test: no dirt. path cost: 1 per action (0 for NoOp)."

#### الشرح المبسّط:
عالم المكنسة بسيط: مكنسة في أحد غرفتين، كل غرفة قد تكون نظيفة أو متسخة.

| العنصر | القيمة |
| --- | --- |
| `States` | موقع الروبوت (يسار/يمين) + حالة كل غرفة (نظيفة/متسخة) = **8 حالات** |
| `Actions` | `Left`، `Right`، `Suck`، `NoOp` |
| `Goal Test` | كلتا الغرفتين نظيفتان ($NoDirt$) |
| `Path Cost` | 1 لكل إجراء، 0 لـ`NoOp` |

#### 💡 التشبيه:
> تخيّل روبوتاً في شقة بغرفتين، يتحرك يميناً ويساراً ويشفط الأوساخ — أبسط حالة ممكنة لعالم البحث.

---

### 5. Example: The 8-Puzzle (لعبة الـ 8)

#### النص الأصلي يقول:
> "states: integer locations of tiles (ignore intermediate positions). actions: move blank left, right, up, down (ignore unjamming etc.). goal test: = goal state (given). path cost: 1 per move. Note: optimal solution of n-Puzzle family is NP-hard."

#### الشرح المبسّط:
لوحة 3×3 بها أرقام 1-8 وخانة فارغة. نريد ترتيب الأرقام بترتيب معيّن.

| العنصر | القيمة |
| --- | --- |
| `States` | 9!/2 = 181,440 حالة ممكنة |
| `Actions` | تحريك الفراغ: يسار، يمين، أعلى، أسفل |
| `Goal Test` | الحالة تطابق الهدف المعطى |
| `Path Cost` | 1 لكل حركة |

#### مهم للامتحان ⚠️:
> الحل الأمثل لعائلة **n-Puzzle** هو **NP-hard** — أي أنه مكلف حسابياً عند الأحجام الكبيرة.

---

### 6. Example: Robotic Assembly (مثال التجميع الروبوتي)

#### النص الأصلي يقول:
> "states: real-valued coordinates of robot joint angles, parts of the object to be assembled. actions: continuous motions of robot joints. goal test: complete assembly with no robot included! path cost: time to execute."

#### الشرح المبسّط:
هنا الفضاء **متواصل** (continuous) لا منفصل:

| العنصر | القيمة |
| --- | --- |
| `States` | زوايا مفاصل الروبوت (أعداد حقيقية) + مكونات القطعة |
| `Actions` | حركات مستمرة للمفاصل |
| `Goal Test` | التجميع مكتمل **بدون** الروبوت في الصورة |
| `Path Cost` | الوقت اللازم للتنفيذ |

---

### 7. Tree Search Algorithms (خوارزميات البحث على الشجرة)

#### النص الأصلي يقول:
> "Basic idea: offline, simulated exploration of state space by generating successors of already-explored states (a.k.a. expanding states)."

#### الشرح المبسّط:
البحث على الشجرة يعمل بمحاكاة استكشاف فضاء الحالات دون تحرك فعلي، عبر **توسيع** العقد (إنشاء الأبناء).

#### 💡 التشبيه:
> مثل لعبة الشطرنج تفكّر في كل الحركات الممكنة قبل أن تحرّك قطعة — الشجرة هي كل الاحتمالات في ذهنك.
> **وجه الشبه:** تخيّل الحركات = `simulate exploration` | الحركة الفعلية = `execute solution`.

---

#### 💻 الكود: Tree Search

#### ما هذا الكود؟
> الدالة الأساسية التي تستكشف فضاء الحالات بتوسيع العُقد وفق `strategy` معينة حتى تجد الهدف أو تفشل.

```text
// Tree Search — explores state space to find a solution
function TREE-SEARCH(problem, strategy) returns a solution, or failure
  initialize the search tree using the initial state of problem  // start from root
  loop do
    if there are no candidates for expansion then return failure  // no solution exists
    choose a leaf node for expansion according to strategy        // strategy decides order
    if the node contains a goal state then return the solution    // goal found
    else expand the node and add resulting nodes to search tree   // generate children
  end
```

#### شرح كل سطر:
1. `initialize` → إنشاء شجرة البحث بعقدة جذر = الحالة الابتدائية.
2. `loop do` → نكرر حتى نجد حلاً أو نفشل.
3. `if no candidates` → إذا انتهت العقد دون حل → فشل.
4. `choose a leaf node according to strategy` → هنا يكمن الفرق بين `BFS` و`DFS` وغيرهما.
5. `if goal state → return` → نجاح: المسار من الجذر لهذه العقدة هو الحل.
6. `else expand` → نولّد الأبناء ونضيفهم للشجرة.

**الناتج المتوقع:**
> مسار من الحالة الابتدائية إلى حالة الهدف، أو `failure` إذا لا يوجد حل.

---

#### 💻 الكود: General Tree Search (التفصيلي)

#### ما هذا الكود؟
> نسخة مفصّلة تستخدم `fringe` (قائمة انتظار) لإدارة العُقد المنتظرة.

```text
// General Tree Search with explicit fringe management
function TREE-SEARCH(problem, fringe) returns a solution, or failure
  fringe ← INSERT(MAKE-NODE(INITIAL-STATE[problem]), fringe)  // insert root node
  loop do
    if fringe is empty then return failure                     // no nodes left
    node ← REMOVE-FRONT(fringe)                               // pick next node
    if GOAL-TEST(problem, STATE(node)) then return node        // goal check
    fringe ← INSERTALL(EXPAND(node, problem), fringe)         // add children
```

```text
// Expand — generates all successor nodes of a given node
function EXPAND(node, problem) returns a set of nodes
  successors ← the empty set
  for each action, result in SUCCESSOR-FN(problem, STATE[node]) do  // for each action
    s ← a new NODE                                                    // create child
    PARENT-NODE[s] ← node                                            // link to parent
    ACTION[s] ← action                                               // store action
    STATE[s] ← result                                                // store state
    PATH-COST[s] ← PATH-COST[node] + STEP-COST(node, action, s)     // accumulate cost
    DEPTH[s] ← DEPTH[node] + 1                                       // increment depth
    add s to successors
  return successors
```

#### شرح كل سطر (EXPAND):
1. `successors ← empty` → تهيئة مجموعة الأبناء الفارغة.
2. `for each action, result` → لكل إجراء ممكن من الحالة الحالية.
3. `s ← new NODE` → إنشاء عقدة ابن جديدة.
4. `PARENT-NODE[s]` → ربط الابن بالأب لاسترجاع المسار لاحقاً.
5. `PATH-COST[s]` → تراكم التكلفة: تكلفة الأب + تكلفة الخطوة الجديدة.
6. `DEPTH[s]` → العمق = عمق الأب + 1.

---

### 8. States vs. Nodes (الحالات مقابل العُقد)

#### النص الأصلي يقول:
> "A state is a (representation of) a physical configuration. A node is a data structure constituting part of a search tree — includes parent, children, depth, path cost g(x). States do not have parents, children, depth, or path cost!"

#### الشرح المبسّط:
فرق جوهري يخلط فيه كثير من الطلاب:

| الجانب | `State` (حالة) | `Node` (عقدة) |
| --- | --- | --- |
| التعريف | تمثيل لتهيئة فيزيائية | بنية بيانات في شجرة البحث |
| المعلومات | الحالة فقط | حالة + أب + عمق + تكلفة المسار |
| العلاقات | لا أب ولا عمق | تحتوي الأب والعمق والتكلفة |
| مثال | "المكنسة في الغرفة اليسرى" | عقدة عمق 3، g=3، أبوها عقدة عمق 2 |

**الفهم الخاطئ الشائع ❌:** "الحالة والعقدة نفس الشيء."
**الفهم الصحيح ✅:** الحالة جزء من العقدة، لكن العقدة تضم معلومات إضافية عن موضعها في الشجرة.

---

### 9. Search Strategies (استراتيجيات البحث)

#### النص الأصلي يقول:
> "A strategy is defined by picking the order of node expansion. Strategies are evaluated along four dimensions: completeness, time complexity, space complexity, optimality. Measured by b (branching factor), d (depth of least-cost solution), m (maximum depth)."

#### الشرح المبسّط:
الاستراتيجية = **ما العقدة التي توسّعها التالية؟**

| معيار التقييم | السؤال |
| --- | --- |
| `Completeness` | هل يجد الحل دائماً إن وُجد؟ |
| `Time Complexity` | كم عقدة يولّد/يوسّع؟ |
| `Space Complexity` | كم عقدة في الذاكرة في أي وقت؟ |
| `Optimality` | هل يجد دائماً الحل الأقل تكلفة؟ |

#### 📐 المعادلة: معاملات التعقيد

$$
b = \text{branching factor (عامل التفرع)}, \quad d = \text{depth of solution}, \quad m = \text{max depth}
$$

**الشرح:**
> - $b$ = العدد الأقصى لأبناء أي عقدة.
> - $d$ = عمق الحل الأقل تكلفة.
> - $m$ = أقصى عمق في فضاء الحالات (قد يكون $\infty$).

---

### 10. Uninformed Search Strategies (استراتيجيات البحث غير الموجّه)

#### النص الأصلي يقول:
> "Uninformed strategies use only the information available in the problem definition."

#### الشرح المبسّط:
`Uninformed` = لا تعرف أين الهدف، تبحث "بعمى" — تعتمد فقط على بنية المسألة لا على تقدير المسافة للهدف.

تشمل: `Breadth-First Search`، `Uniform-Cost Search`، `Depth-First Search`، `Depth-Limited Search`، `Iterative Deepening Search`.

#### 💡 التشبيه:
> مثل الفرق بين شخص يبحث عن مفتاحه في كل أدراج البيت بالترتيب (uninformed) وآخر يتذكر أنه كان في الغرفة (informed).
> **وجه الشبه:** البحث بلا ذاكرة عن الموقع = `uninformed`.

---

### 11. Breadth-First Search — BFS (البحث بالاتساع أولاً)

#### النص الأصلي يقول:
> "Expand shallowest unexpanded node. Implementation: fringe is a FIFO queue, i.e., new successors go at end."

#### الشرح المبسّط:
`BFS` يوسّع العقد **مستوىً مستوىً** — يكمل كل المستوى الحالي قبل الانتقال للتالي.

#### 💡 التشبيه:
> مثل تفتيش شرطي يفتش كل الغرف في الطابق الأول قبل صعود الطابق الثاني.
> **وجه الشبه:** الطابق = `depth level` | ترتيب الفتيش = `FIFO queue`.

---

#### 💻 الكود: BFS

```text
// Breadth-First Search — expands shallowest node first
function BFS(problem) returns a solution or failure
  fringe ← FIFO-QUEUE(MAKE-NODE(INITIAL-STATE[problem]))  // root in FIFO queue
  loop do
    if fringe is empty then return failure                  // no solution
    node ← REMOVE-FRONT(fringe)                            // take from front
    if GOAL-TEST(problem, STATE(node)) then return node     // goal check
    fringe ← INSERT-ALL(EXPAND(node, problem), fringe)     // add children to end
```

#### شرح كل سطر:
1. `FIFO-QUEUE` → قائمة انتظار: الأقدم يخرج أولاً → يضمن توسيع الأضحل أولاً.
2. `REMOVE-FRONT` → إزالة العقدة الأمامية (الأقدم = الأضحل).
3. `GOAL-TEST` → فحص قبل التوسيع.
4. `INSERT-ALL ... to end` → إضافة الأبناء للنهاية — يبقيهم بعد كل العقد الحالية.

**الناتج المتوقع (مثال A→B→C):**
> ترتيب التوسيع: A، ثم B وC (المستوى 1)، ثم D وE وF وG (المستوى 2).

#### خصائص BFS:

| الخاصية | القيمة | الشرح |
| --- | --- | --- |
| `Complete?` | نعم (إذا $b$ منتهٍ) | يصل لأي عقدة في الشجرة المنتهية |
| `Time` | $O(b^{d+1})$ | يولّد كل عقد حتى العمق $d+1$ |
| `Space` | $O(b^{d+1})$ | يحتفظ بكل عقدة في الذاكرة |
| `Optimal?` | نعم (إذا التكلفة 1 لكل خطوة) | أقل عمق = أقل خطوات |

#### مهم للامتحان ⚠️:
> `Space` هو المشكلة الكبرى في `BFS` — ينتج عُقداً بمعدل 100MB/ثانية → 24 ساعة = 8640 GB!

---

### 12. Uniform-Cost Search — UCS (البحث بالتكلفة الموحدة)

#### النص الأصلي يقول:
> "Expand least-cost unexpanded node. Implementation: fringe = queue ordered by path cost, lowest first. Equivalent to breadth-first if step costs all equal. Complete if step cost ≥ ε."

#### الشرح المبسّط:
`UCS` هو تعميم `BFS` للحالات التي تختلف فيها تكاليف الخطوات. يوسّع العقدة ذات **أقل تكلفة تراكمية** $g(n)$.

#### 💡 التشبيه:
> مثل نظام الأولوية في المستشفى — من أشد الحالات خطورة يُعالَج أولاً، لا من وصل أولاً.
> **وجه الشبه:** خطورة الحالة = `path cost` | ترتيب المعالجة = `priority queue`.

#### 📐 المعادلة: دالة UCS

$$
g(n) = \text{path cost from root to node } n
$$

**الشرح:**
> - $g(n)$ = مجموع تكاليف الخطوات من الجذر لـ$n$.
> - `UCS` يُبقي `fringe` مرتّباً بـ$g$ تصاعدياً.

---

#### 💻 الكود: Uniform-Cost Search

```text
// Uniform-Cost Search — expands node with lowest g(n)
function UCS(problem) returns a solution or failure
  fringe ← PRIORITY-QUEUE ordered by PATH-COST, lowest first  // priority queue
  INSERT(MAKE-NODE(INITIAL-STATE[problem]), fringe)             // insert root (cost=0)
  loop do
    if fringe is empty then return failure                       // no solution
    node ← REMOVE-MIN(fringe)                                   // take lowest-cost node
    if GOAL-TEST(problem, STATE(node)) then return node          // goal reached
    fringe ← INSERT-ALL(EXPAND(node, problem), fringe)          // add children by cost
```

#### خصائص UCS:

| الخاصية | القيمة | الشرح |
| --- | --- | --- |
| `Complete?` | نعم (إذا تكلفة الخطوة $\geq \epsilon > 0$) | يمنع التكاليف الصفرية من حلقات لا نهائية |
| `Time` | $O(b^{\lceil C^*/\epsilon \rceil})$ | حيث $C^*$ تكلفة الحل الأمثل |
| `Space` | $O(b^{\lceil C^*/\epsilon \rceil})$ | نفس الوقت |
| `Optimal?` | نعم | يوسّع بترتيب تصاعدي لـ$g(n)$ |

#### 📐 المعادلة: تعقيد UCS

$$
O\!\left(b^{\lceil C^*/\epsilon \rceil}\right)
$$

**الشرح:**
> - $C^*$ = تكلفة الحل الأمثل.
> - $\epsilon$ = أقل تكلفة ممكنة لخطوة واحدة.
> - العدد الكلي للعُقد $\approx$ الأسية بعمق $C^*/\epsilon$.

#### ⚖️ المقايضة: BFS vs UCS

| | `BFS` | `UCS` |
| --- | --- | --- |
| **المزايا** | بسيط التنفيذ | يجد الحل الأمثل بتكاليف مختلفة |
| **العيوب** | لا يعمل مع تكاليف مختلفة | أبطأ من BFS عند التكاليف المتساوية |
| **متى تختاره** | تكاليف موحدة أو غير مهمة | تكاليف مختلفة ونريد الأمثل |

---

### 13. Depth-First Search — DFS (البحث بالعمق أولاً)

#### النص الأصلي يقول:
> "Expand deepest unexpanded node. Implementation: fringe = LIFO queue, i.e., put successors at front."

#### الشرح المبسّط:
`DFS` يغوص في أعمق فرع ممكن أولاً قبل أن يتراجع (`backtrack`) ويجرب فرعاً آخر.

#### 💡 التشبيه:
> مثل شخص يستكشف متاهة — يسير في ممر بعيداً حتى يصطدم بجدار، ثم يرجع ويجرب ممراً آخر.
> **وجه الشبه:** السير في ممر = `depth-first` | الرجوع = `backtracking`.

---

#### 💻 الكود: DFS

```text
// Depth-First Search — expands deepest node first
function DFS(problem) returns a solution or failure
  fringe ← LIFO-STACK(MAKE-NODE(INITIAL-STATE[problem]))  // root in LIFO stack
  loop do
    if fringe is empty then return failure                  // no solution
    node ← REMOVE-FRONT(fringe)                            // take from top (deepest)
    if GOAL-TEST(problem, STATE(node)) then return node     // goal check
    fringe ← INSERT-ALL(EXPAND(node, problem), fringe)     // push children to front
```

#### شرح كل سطر:
1. `LIFO-STACK` → مكدس: الأحدث يخرج أولاً → يضمن توسيع الأعمق أولاً.
2. `REMOVE-FRONT` → إزالة من قمة المكدس.
3. `INSERT-ALL ... to front` → دفع الأبناء للقمة → يصبحون التاليين للتوسيع.

#### خصائص DFS:

| الخاصية | القيمة | الشرح |
| --- | --- | --- |
| `Complete?` | لا | يفشل في الفضاءات اللانهائية أو ذات الحلقات |
| `Time` | $O(b^m)$ | فظيع إذا $m \gg d$ |
| `Space` | $O(bm)$ | خطي! الميزة الكبرى |
| `Optimal?` | لا | قد يجد حلاً أعمق قبل الأمثل |

#### نقطة مهمة ⚠️:
> **ميزة DFS الرئيسية:** مساحة ذاكرة **خطية** $O(bm)$ — يتذكر فقط المسار الحالي وأشقاء العقد عليه.

---

### 14. Depth-Limited Search (البحث بالعمق المحدود)

#### النص الأصلي يقول:
> "= depth-first search with depth limit l, i.e., nodes at depth l have no successors."

#### الشرح المبسّط:
حلٌّ لمشكلة `DFS` في الفضاءات اللانهائية: نضع سقفاً للعمق $l$.

---

#### 💻 الكود: Depth-Limited Search

#### ما هذا الكود؟
> يطبّق `DFS` مع إيقاف التوسيع عند العمق $l$. يُرجع `cutoff` إذا وصل للحد ولم يجد الحل.

```text
// Depth-Limited Search — DFS with depth limit l
function DEPTH-LIMITED-SEARCH(problem, limit) returns soln/fail/cutoff
  RECURSIVE-DLS(MAKE-NODE(INITIAL-STATE[problem]), problem, limit)  // start recursion

function RECURSIVE-DLS(node, problem, limit) returns soln/fail/cutoff
  cutoff-occurred? ← false                                          // track if cutoff hit
  if GOAL-TEST(problem, STATE[node]) then return node               // goal found
  else if DEPTH[node] = limit then return cutoff                    // depth limit reached
  else for each successor in EXPAND(node, problem) do              // try all children
    result ← RECURSIVE-DLS(successor, problem, limit)              // recurse
    if result = cutoff then cutoff-occurred? ← true                 // mark cutoff
    else if result ≠ failure then return result                     // solution found
  if cutoff-occurred? then return cutoff else return failure        // final verdict
```

#### شرح كل سطر:
1. `cutoff-occurred?` → علامة: هل وصلنا لحد العمق مرة على الأقل؟
2. `GOAL-TEST` → نجاح مباشر.
3. `DEPTH[node] = limit` → حد العمق → نُرجع `cutoff` لا `failure` (الفرق مهم!).
4. `for each successor` → استدعاء متعدد التكرار (recursive).
5. `if result = cutoff → cutoff-occurred?` → نتذكر أن الحل ربما موجود لكن خارج الحد.
6. `else if result ≠ failure` → وجدنا حلاً → نُرجعه فوراً.

**الناتج المتوقع:**
> `solution` (وجد في حدود العمق) | `cutoff` (الحد وصل قبل الهدف) | `failure` (لا حل أصلاً).

---

### 15. Iterative Deepening Search — IDS (البحث بالتعمق المتكرر)

#### النص الأصلي يقول:
> الخوارزمية تشغّل `DEPTH-LIMITED-SEARCH` بدءاً من `depth=0` وتزيد الحد حتى تجد حلاً.

#### الشرح المبسّط:
`IDS` يجمع أفضل ما في `BFS` (اكتمال + optimality) مع أفضل ما في `DFS` (مساحة خطية). الفكرة: جرّب `DFS` بحد عمق 0، ثم 1، ثم 2... حتى تجد الحل.

#### 💡 التشبيه:
> كأنك تبحث عن مفتاح مفقود: أولاً تبحث في دائرة نصف قطرها متر، ثم مترين، ثم ثلاثة — تزيد الدائرة تدريجياً.
> **وجه الشبه:** نصف القطر = `depth limit` | التوسيع التدريجي = `iterative deepening`.

---

#### 💻 الكود: Iterative Deepening Search

```text
// Iterative Deepening Search — combines BFS completeness with DFS space efficiency
function ITERATIVE-DEEPENING-SEARCH(problem) returns a solution
  inputs: problem                           // the search problem
  for depth ← 0 to ∞ do                   // increase limit from 0 upward
    result ← DEPTH-LIMITED-SEARCH(problem, depth)  // try DFS with current limit
    if result ≠ cutoff then return result  // found solution or definite failure
  end
```

#### شرح كل سطر:
1. `for depth ← 0 to ∞` → نبدأ من 0 ونزيد تدريجياً.
2. `DEPTH-LIMITED-SEARCH(problem, depth)` → نشغّل DLS مع الحد الحالي.
3. `if result ≠ cutoff → return` → إما وجدنا حلاً أو تأكدنا من عدم الوجود.

**الناتج المتوقع:**
> يجد الحل الأضحل أولاً (مثل BFS)، لكن بمساحة O(bd).

#### خصائص IDS:

| الخاصية | القيمة | الشرح |
| --- | --- | --- |
| `Complete?` | نعم | لن يفوته عمق يُمثّل حلاً |
| `Time` | $O(b^d)$ | أفضل عملياً من BFS |
| `Space` | $O(bd)$ | خطي كـDFS |
| `Optimal?` | نعم (إذا تكلفة = 1) | يجد الأضحل = الأقل خطوات |

#### 📐 المعادلة: تعقيد IDS

$$
(d+1)b^0 + db^1 + (d-1)b^2 + \cdots + b^d = O(b^d)
$$

**الشرح:**
> رغم إعادة التوسيع مرات متعددة، معظم العمل يُنجز في المستوى الأخير. العُقد العليا تُعاد معالجتها لكن عددها صغير قياساً بالمستوى $d$.

#### مقارنة عددية (b=10, d=5):
> - $N(\text{IDS}) = 50 + 400 + 3{,}000 + 20{,}000 + 100{,}000 = 123{,}450$
> - $N(\text{BFS}) = 10 + 100 + 1{,}000 + 10{,}000 + 100{,}000 + 999{,}990 = 1{,}111{,}100$

#### الدرس المستفاد:
> **IDS أفضل** لأن عقد المستوى الأخير ($d$) لا تُوسَّع في التكرارات السابقة!

---

## الجزء الثاني: ملخص منظم

---

### أهم التعاريف والمفاهيم

| المصطلح | التعريف | مثال/ملاحظة |
| --- | --- | --- |
| `State` | تمثيل لتهيئة فيزيائية للعالم | "Arad"، لوحة 8-puzzle في ترتيب معيّن |
| `Node` | بنية بيانات في شجرة البحث | تحتوي: state، parent، action، depth، g(x) |
| `Fringe` | قائمة العُقد المنتظرة للتوسيع | في BFS: FIFO، في DFS: LIFO، في UCS: Priority |
| `Expanding` | توليد كل أبناء عقدة | تطبيق SUCCESSOR-FN على الحالة |
| `Search Tree` | الشجرة الناتجة عن استكشاف فضاء الحالات | تختلف عن State Space Graph |
| `State Space` | مجموعة كل الحالات الممكنة + الانتقالات | خريطة رومانيا |
| `Successor Function` | $S(x)$ = أزواج (إجراء، حالة) من حالة x | $S(\text{Arad}) = \{(\text{→Zerind}, \text{Zerind}), ...\}$ |
| `Path Cost` | مجموع تكاليف الخطوات على مسار | مجموع المسافات في رومانيا |
| `Step Cost` | $c(x,a,y) \geq 0$ | المسافة بين مدينتين |
| `Branching Factor b` | العدد الأقصى لأبناء أي عقدة | في رومانيا: ~3-4 |
| `Depth d` | عمق الحل الأقل تكلفة | — |
| `cutoff` | وصل لحد العمق قبل الهدف (ليس فشلاً نهائياً) | خاص بـ DLS |
| `Offline Solving` | تخطيط كامل قبل التنفيذ | عكس Online Solving |
| `Uninformed Search` | يعتمد فقط على تعريف المسألة | BFS، DFS، UCS، IDS |

---

### جداول مقارنات سريعة

#### مقارنة الخوارزميات غير الموجّهة:

| المعيار | `BFS` | `UCS` | `DFS` | `DLS` | `IDS` |
| --- | --- | --- | --- | --- | --- |
| `Complete?` | نعم* | نعم* | **لا** | نعم إذا $l \geq d$ | **نعم** |
| `Time` | $b^{d+1}$ | $b^{\lceil C^*/\epsilon \rceil}$ | $b^m$ | $b^l$ | $b^d$ |
| `Space` | $b^{d+1}$ | $b^{\lceil C^*/\epsilon \rceil}$ | $bm$ | $bl$ | $bd$ |
| `Optimal?` | نعم* | **نعم** | **لا** | **لا** | نعم* |

> *نعم إذا $b$ منتهٍ أو التكلفة = 1 لكل خطوة.

#### مقارنة بنية الـ Fringe:

| الخوارزمية | نوع `fringe` | منطق الترتيب |
| --- | --- | --- |
| `BFS` | FIFO Queue | الأقدم أولاً → الأضحل |
| `DFS` | LIFO Stack | الأحدث أولاً → الأعمق |
| `UCS` | Priority Queue | الأقل $g(n)$ أولاً |
| `IDS` | Stack (داخل DLS) | نفس DFS |

---

### قاموس المصطلحات

| الفئة | المصطلحات |
| --- | --- |
| بنية المسألة | `Initial State`، `Successor Function`، `Goal Test`، `Path Cost`، `Step Cost` |
| خوارزميات | `BFS`، `DFS`، `UCS`، `DLS`، `IDS` |
| هياكل البيانات | `Fringe`، `FIFO Queue`، `LIFO Stack`، `Priority Queue` |
| معاملات التعقيد | $b$، $d$، $m$، $C^*$، $\epsilon$ |
| نتائج البحث | `solution`، `failure`، `cutoff` |
| أنواع الشرح | `Offline Solving`، `Online Solving`، `Expanding`، `Backtracking` |

---

### أبرز النقاط الذهبية

1. `IDS` هو الخوارزمية المفضّلة عملياً في الـ `Uninformed Search` — يجمع اكتمال BFS مع مساحة DFS.
2. `UCS` يضمن الأمثل مع تكاليف مختلفة؛ `BFS` فقط مع تكاليف متساوية.
3. `DFS` ممتاز في المساحة لكن **غير مكتمل** في الفضاءات اللانهائية أو ذات الحلقات.
4. الفرق بين `State` و`Node` أساسي — لا تخلط بينهما.
5. `cutoff` ≠ `failure`: `cutoff` يعني "ربما الحل موجود لكن خارج الحد".
6. زيادة الاستراتيجية = تغيير ترتيب `fringe` فقط — الإطار العام واحد.
7. `BFS` يحتفظ بكل عقدة في الذاكرة → مشكلة فضاء هائلة.

---

### الأخطاء الشائعة عند الطلاب ⚠️

| الخطأ | التصحيح |
| --- | --- |
| "DFS مكتمل" | DFS غير مكتمل في الفضاءات اللانهائية أو ذات الحلقات |
| "BFS أفضل من IDS" | IDS أسرع عملياً وأقل استهلاكاً للذاكرة |
| "UCS = BFS" | UCS تعميم لـBFS — متطابقان فقط عند تكاليف متساوية |
| "cutoff = failure" | cutoff يعني الحل ربما موجود لكن خارج الحد المحدد |
| "State = Node" | Node تحتوي State + معلومات إضافية |
| "IDS يضيع وقتاً بإعادة التوسيع" | التكرار رخيص لأن معظم العمل في المستوى الأخير |

---

### خطوات وإجراءات المحاضرة

#### ⚙️ الخطوات / الخوارزمية: BFS
> توسيع الأضحل أولاً — مستوى بمستوى.

```algorithm
1 | تهيئة | FIFO Queue | أضف الجذر للقائمة
2 | فحص الفراغ | Fringe | إذا فارغة → فشل
3 | استخراج | REMOVE-FRONT | أخرج العقدة الأمامية
4 | فحص الهدف | GOAL-TEST | إذا هدف → أرجع الحل
5 | التوسيع | EXPAND + INSERT-ALL | أضف الأبناء لنهاية القائمة
6 | تكرار | — | عد لخطوة 2
```

#### نقاط التنفيذ:
- الأبناء تُضاف لـ**نهاية** القائمة (لا البداية).
- يعالج كل المستوى $d$ قبل الانتقال لـ $d+1$.

---

#### ⚙️ الخطوات / الخوارزمية: DFS
> توسيع الأعمق أولاً — تعمّق في فرع ثم تراجع.

```algorithm
1 | تهيئة | LIFO Stack | أضف الجذر للمكدس
2 | فحص الفراغ | Fringe | إذا فارغة → فشل
3 | استخراج | REMOVE-TOP | أخرج من قمة المكدس
4 | فحص الهدف | GOAL-TEST | إذا هدف → أرجع الحل
5 | التوسيع | EXPAND + PUSH-FRONT | أضف الأبناء لمقدمة المكدس
6 | تكرار | — | عد لخطوة 2
```

#### نقاط التنفيذ:
- الأبناء تُضاف لـ**مقدمة** المكدس → يصبحون التاليين للتوسيع.
- تتراجع تلقائياً عند نفاد الفرع الحالي.

---

#### ⚙️ الخطوات / الخوارزمية: UCS
> توسيع الأقل تكلفة أولاً.

```algorithm
1 | تهيئة | Priority Queue | أضف الجذر (g=0)
2 | فحص الفراغ | Fringe | إذا فارغة → فشل
3 | استخراج | REMOVE-MIN(g) | أخرج العقدة ذات أقل g(n)
4 | فحص الهدف | GOAL-TEST | إذا هدف → أرجع الحل
5 | التوسيع | EXPAND | احسب g للأبناء
6 | الإدراج | INSERT-ALL | أدرج بالترتيب حسب g
7 | تكرار | — | عد لخطوة 2
```

---

#### ⚙️ الخطوات / الخوارزمية: IDS
> زيادة حد العمق تدريجياً.

```algorithm
1 | تهيئة | depth=0 | ابدأ بحد 0
2 | تشغيل DLS | DEPTH-LIMITED-SEARCH | جرّب DFS بالحد الحالي
3 | فحص النتيجة | result | إذا ≠ cutoff → أرجع النتيجة
4 | زيادة الحد | depth++ | إذا = cutoff → زد الحد بـ1
5 | تكرار | — | عد لخطوة 2
```

---

### أنماط الأكواد والبنى المتكررة

| النمط | البنية الأساسية | متى تستخدمه |
| --- | --- | --- |
| `fringe + loop` | إدراج جذر → حلقة → استخراج → فحص → توسيع | كل خوارزميات البحث |
| `FIFO Queue` | `INSERT-END + REMOVE-FRONT` | BFS |
| `LIFO Stack` | `INSERT-FRONT + REMOVE-FRONT` | DFS |
| `Priority Queue` | `INSERT-BY-COST + REMOVE-MIN` | UCS |
| `Recursive DLS` | استدعاء ذاتي مع تناقص الحد | DLS، IDS |

---

### أنماط التعامل والسلوك

| السيناريو | التعامل الصحيح | لماذا؟ |
| --- | --- | --- |
| تكاليف موحدة + نريد الأمثل | BFS | أبسط وأسرع |
| تكاليف مختلفة + نريد الأمثل | UCS | يضمن الأقل تكلفة |
| مساحة محدودة + عمق معروف | DLS | يقيّد الذاكرة |
| لا معرفة بالعمق + نريد الأمثل | IDS | أفضل توازن عملي |
| فضاء محدود + سرعة أهم من الأمثل | DFS | مساحة خطية |

---

## الجزء الثالث: أسئلة اختيار من متعدد (MCQ)

> **18 سؤالاً** — مستوى: medium/hard. التوزيع: مقارنات 25% | pseudocode/تتبع 35% | تطبيق 25% | تتبع خوارزمية 15%.

---

### السؤال 1 (medium) — مقارنة خوارزميات
أي خوارزمية بحث **تضمن** الحل الأمثل عند اختلاف تكاليف الخطوات؟

أ) BFS  
ب) DFS  
ج) UCS  
د) DLS  

**الإجابة الصحيحة: ج**
**التعليل:**
- **أ) BFS خاطئ:** BFS يجد الأقل عدد خطوات، لا الأقل تكلفة، إلا إذا كانت التكاليف متساوية.
- **ب) DFS خاطئ:** DFS يجد أول حل يقع عليه بغض النظر عن تكلفته.
- **ج) UCS صحيح:** يوسّع بترتيب $g(n)$ تصاعدياً → أول هدف يجده هو الأقل تكلفة.
- **د) DLS خاطئ:** مقيّد بالعمق ولا يعتبر التكاليف.

---

### السؤال 2 (hard) — تتبع BFS
في شجرة بها الجذر A وأبناء B وC، وأبناء B هم D وE، وأبناء C هم F وG، ما ترتيب توسيع BFS؟

أ) A, B, D, E, C, F, G  
ب) A, B, C, D, E, F, G  
ج) A, D, E, B, F, G, C  
د) A, C, B, G, F, E, D  

**الإجابة الصحيحة: ب**
**التعليل:**
- **أ) خاطئ:** هذا ترتيب DFS — يعمّق في B قبل C.
- **ب) صحيح:** BFS يُكمل المستوى 1 (B, C) ثم المستوى 2 (D, E, F, G).
- **ج) خاطئ:** D وE قبل C خطأ في BFS.
- **د) خاطئ:** يعكس الترتيب.

---

### السؤال 3 (hard) — تتبع DFS
نفس الشجرة أعلاه. ما ترتيب توسيع DFS إذا أضيف الأبناء بالترتيب الأبجدي؟

أ) A, B, C, D, E, F, G  
ب) A, B, D, E, C, F, G  
ج) A, C, G, F, B, E, D  
د) A, D, B, E, C, F, G  

**الإجابة الصحيحة: ب**
**التعليل:**
- **أ) خاطئ:** هذا BFS.
- **ب) صحيح:** DFS يغوص: A→B→D (لا أبناء)→E (لا أبناء)→C→F→G.
- **ج) خاطئ:** يبدأ من C قبل B.
- **د) خاطئ:** ترتيب غير منطقي.

---

### السؤال 4 (hard) — pseudocode UCS
في الكود التالي، لماذا يُرجع UCS الحل الأمثل؟

```text
node ← REMOVE-MIN(fringe)
if GOAL-TEST(problem, STATE(node)) then return node
```

أ) لأنه يختبر الهدف عند الإضافة للقائمة  
ب) لأنه يوسّع العقد بترتيب $g(n)$ تصاعدي → أول هدف = أقل تكلفة  
ج) لأنه يستخدم heuristic  
د) لأنه يوسّع كل العقد  

**الإجابة الصحيحة: ب**
**التعليل:**
- **أ) خاطئ:** الاختبار عند الإزالة (لا الإضافة) — هذه خاصية مهمة.
- **ب) صحيح:** بترتيب $g(n)$ التصاعدي، أول عقدة هدف تُزال = أقل تكلفة تراكمية.
- **ج) خاطئ:** UCS لا يستخدم heuristic.
- **د) خاطئ:** يتوقف فور إيجاد الهدف.

---

### السؤال 5 (medium) — مقارنة مساحة الذاكرة
أي خوارزمية تستهلك ذاكرة **خطية** $O(bm)$؟

أ) BFS  
ب) UCS  
ج) DFS  
د) BFS و UCS معاً  

**الإجابة الصحيحة: ج**
**التعليل:**
- **أ) خاطئ:** BFS يحتفظ بكل عقدة → $O(b^{d+1})$ أسية.
- **ب) خاطئ:** UCS مثل BFS في المساحة → $O(b^{\lceil C^*/\epsilon \rceil})$.
- **ج) صحيح:** DFS يحتفظ فقط بالمسار الحالي وأشقاء عقده → $O(bm)$ خطي.
- **د) خاطئ:** كلاهما أسية.

---

### السؤال 6 (hard) — IDS vs BFS عملياً
لماذا يُفضَّل IDS على BFS في الممارسة العملية رغم إعادة التوسيع؟

أ) لأن IDS أسرع في الوقت دائماً  
ب) لأن مساحة IDS خطية بينما BFS أسية → IDS يُكمل مسائل أكبر بكثير  
ج) لأن IDS يجد الحل الأمثل دائماً وBFS لا  
د) لأن IDS لا يُعيد توسيع أي عقدة  

**الإجابة الصحيحة: ب**
**التعليل:**
- **أ) خاطئ:** IDS أحياناً أبطأ في الوقت لكن الفرق صغير.
- **ب) صحيح:** $O(bd)$ مقابل $O(b^{d+1})$ — الفرق الهائل في المساحة هو المحدد العملي الأهم.
- **ج) خاطئ:** كلاهما يجد الأمثل عند تكاليف متساوية.
- **د) خاطئ:** IDS يُعيد التوسيع في كل تكرار — لكن التكلفة مقبولة.

---

### السؤال 7 (hard) — تتبع UCS
في الرسم البياني: A→B (تكلفة 1)، A→C (تكلفة 15)، A→D (تكلفة 3)، B→F (تكلفة 10)، D→E (تكلفة 5)، E→F (تكلفة 1). الهدف F. ما أول عقدة تُزال من fringe بعد A؟

أ) B (g=1)  
ب) C (g=15)  
ج) D (g=3)  
د) F (g=11)  

**الإجابة الصحيحة: أ**
**التعليل:**
- بعد توسيع A: fringe = {B(g=1), C(g=15), D(g=3)}.
- **أ) صحيح:** B أقل g=1 → تُزال أولاً.
- **ب) خاطئ:** C أعلى تكلفة.
- **ج) خاطئ:** D=3 > B=1.
- **د) خاطئ:** F ليست في fringe بعد.

---

### السؤال 8 (medium) — خاصية الاكتمال
أي خوارزمية **غير مكتملة** في الفضاءات ذات الحلقات (loops)؟

أ) BFS  
ب) DFS  
ج) UCS  
د) IDS  

**الإجابة الصحيحة: ب**
**التعليل:**
- **أ) خاطئ:** BFS مكتمل إذا b منتهٍ.
- **ب) صحيح:** DFS قد يدور في حلقات لانهائية ولا يجد الحل.
- **ج) خاطئ:** UCS مكتمل بشرط تكلفة الخطوة > 0.
- **د) خاطئ:** IDS مكتمل دائماً.

---

### السؤال 9 (hard) — سيناريو DLS
شغّلنا `DEPTH-LIMITED-SEARCH` بحد $l=2$ على مسألة الهدف فيها عمق $d=4$. ما الناتج؟

أ) solution (يجد الحل)  
ب) failure (لا حل موجود)  
ج) cutoff (الحد وُصل قبل الهدف)  
د) يتوقف لا يُرجع شيئاً  

**الإجابة الصحيحة: ج**
**التعليل:**
- **أ) خاطئ:** الهدف عمق 4 > الحد 2.
- **ب) خاطئ:** failure يعني لا حل أصلاً.
- **ج) صحيح:** وصل لعمق 2 ولم يجد الهدف → يُرجع cutoff (ربما الحل موجود لكن أعمق).
- **د) خاطئ:** الدالة ترجع دائماً قيمة.

---

### السؤال 10 (hard) — Formulation
في مسألة 8-puzzle، ما الـ `Successor Function` لحالة الفراغ في المركز؟

أ) تحريك الفراغ في 4 اتجاهات (يسار، يمين، أعلى، أسفل)  
ب) تبادل أي خانتين  
ج) نقل الفراغ مباشرة للخانة المطلوبة  
د) تبادل الفراغ مع الخانة الرقمية المجاورة فقط  

**الإجابة الصحيحة: أ**
**التعليل:**
- **أ) صحيح:** من المركز يمكن التحرك للأعلى والأسفل واليسار واليمين = 4 أبناء.
- **ب) خاطئ:** تبادل أي خانتين ليس القاعدة في 8-puzzle.
- **ج) خاطئ:** لا يمكن القفز.
- **د) خاطئ:** "الخانة الرقمية" تعبير مبهم — الصح "4 اتجاهات".

---

### السؤال 11 (hard) — تعقيد BFS
في مسألة branching factor b=5، الحل في عمق d=3. كم عقدة يولّدها BFS (أسوأ حالة تقريباً)؟

أ) $5^3 = 125$  
ب) $5^4 = 625$  
ج) $1 + 5 + 25 + 125 = 156$  
د) $1 + 5 + 25 + 125 + 5 \times (125-1) \approx 781$  

**الإجابة الصحيحة: د**
**التعليل:**
- **أ) خاطئ:** $b^d$ فقط يحسب المستوى d لا كل العقد.
- **ب) خاطئ:** $b^{d+1}$ بدون طرح عقد الوالدين.
- **ج) خاطئ:** $O(b^{d+1})$ يشمل الأبناء المولَّدين للمستوى $d+1$.
- **د) صحيح:** الصيغة $1 + b + b^2 + \ldots + b^d + b(b^d - 1) = O(b^{d+1})$.

---

### السيناريو 1: تتبع IDS (سيناريو مركّب)

> شجرة بحث: الجذر A، أبناؤه B وC. أبناء B هم D وE. أبناء C هم F وG. الهدف هو **G** (عمق 2). شغّلنا IDS.

### السؤال 12.1 (hard) — IDS بحد 0
بحد عمق $l=0$، ماذا يُرجع IDS؟

أ) solution (G وجد)  
ب) failure  
ج) cutoff  
د) يوسّع A فقط  

**الإجابة الصحيحة: ج**
**التعليل:** A ليست الهدف، حد = 0 → لا يمكن التعمق → cutoff. أ) خاطئ: G عمق 2. ب) خاطئ: failure لو لا حل. د) صحيح الوصف لكن النتيجة = cutoff.

---

### السؤال 12.2 (hard) — IDS بحد 1
بحد $l=1$، ماذا تُوسَّع؟

أ) A, B, C فقط  
ب) A, B, C, D, E, F, G  
ج) A فقط  
د) B, C فقط  

**الإجابة الصحيحة: أ**
**التعليل:** نوسّع A → ينتج B وC. B وC عمق 1 = الحد → لا توسيع → نتيجة cutoff. أ) صحيح. ب) خاطئ: D,E,F,G لا تُوسَّع. ج) خاطئ. د) يغفل A.

---

### السؤال 12.3 (hard) — IDS بحد 2
بحد $l=2$، أين يجد G؟

أ) بعد توسيع A, B, D, E, C, F  
ب) بعد توسيع A, B, C فقط  
ج) لا يجده  
د) بعد توسيع A, C فقط  

**الإجابة الصحيحة: أ**
**التعليل:** DFS بحد 2: A→B→D(cutoff)→E(cutoff)→C→F(not goal)→G (goal!). أ) صحيح. ب) خاطئ: لم يصل لعمق 2 بعد. ج) خاطئ. د) خاطئ.

---

### السؤال 13 (medium) — مقارنة offline vs online
ما الفرق الرئيسي بين `Offline Problem Solving` و`Online Problem Solving`؟

أ) Online أسرع دائماً  
ب) Offline يخطط قبل التنفيذ؛ Online يتصرف بدون معرفة كاملة  
ج) Online يستخدم BFS؛ Offline يستخدم DFS  
د) Offline يعمل في بيئات ديناميكية  

**الإجابة الصحيحة: ب**
**التعليل:** أ) غير صحيح. ب) صحيح: تعريف المحاضرة حرفياً. ج) لا علاقة للخوارزمية بالنوع. د) عكس الصحيح.

---

### السؤال 14 (hard) — Node vs State
أي من التالي هو خاصية لـ`Node` وليس `State`؟

أ) تمثيل التهيئة الفيزيائية  
ب) `Path Cost g(x)`  
ج) نتيجة `Successor Function`  
د) قيمة `Goal Test`  

**الإجابة الصحيحة: ب**
**التعليل:** أ) هذه خاصية State. ب) صحيح: g(x) من خصائص Node لا State. ج) Successor Function تولّد States. د) Goal Test يتحقق من State.

---

### السؤال 15 (hard) — تعقيد IDS
لماذا IDS يُعيد توسيع عقد المستويات العليا مرات متعددة ولكن تكلفته الإجمالية لا تزال $O(b^d)$؟

أ) لأن العقد العليا قليلة جداً مقارنة بالمستوى d  
ب) لأنه لا يُعيد توسيعها فعلاً  
ج) لأن توسيع العقدة مجاني  
د) لأن d يساوي صفراً دائماً  

**الإجابة الصحيحة: أ**
**التعليل:** معظم العقد في المستوى d ($b^d$ عقدة). المستويات الأعلى (1 + b + b² + ...) أصغر بكثير → إعادة توسيعها رخيصة. أ) صحيح. ب) خاطئ. ج) خاطئ. د) خاطئ.

---

### السؤال 16 (medium) — اكتمال DFS مع تعديل
كيف نجعل DFS مكتملاً في الفضاءات المنتهية؟

أ) نزيد branching factor  
ب) نتجنب تكرار الحالات على المسار (avoid repeated states along path)  
ج) نستخدم FIFO بدل LIFO  
د) نضيف heuristic  

**الإجابة الصحيحة: ب**
**التعليل:** أ) يزيد التعقيد لا الاكتمال. ب) صحيح: تجنّب الحلقات يجعله مكتملاً في الفضاءات المنتهية. ج) هذا يحوّله لـBFS. د) هذا يحوّله لـGreedy أو A*.

---

### السؤال 17 (hard) — تطبيق على رومانيا
في مسألة رومانيا، إذا أردنا الحل الأمثل (أقل مسافة) مع تكاليف مختلفة. أي خوارزمية نختار؟

أ) BFS  
ب) DFS  
ج) UCS  
د) DLS  

**الإجابة الصحيحة: ج**
**التعليل:** أ) BFS يجد أقل خطوات لا أقل مسافة. ب) DFS لا يضمن الأمثل. ج) صحيح: UCS يوسّع بترتيب تكلفة المسار → يجد أقل مسافة. د) DLS مقيّد بالعمق.

---

### السؤال 18 (hard) — Vacuum World
في عالم المكنسة (8 حالات)، ما عدد حالات الهدف؟

أ) 1  
ب) 2  
ج) 4  
د) 8  

**الإجابة الصحيحة: ب**
**التعليل:** الهدف هو "لا أوساخ في الغرفتين" — الروبوت يمكن أن يكون في الغرفة اليسرى أو اليمنى مع كلتا الغرفتين نظيفتين → **2 حالات هدف**. أ) خاطئ. ب) صحيح. ج) ود) خاطئ.

---

## الجزء الرابع: أسئلة تصحيح الخوارزميات (Pseudocode Debug)

> غطِّ أنواع الأخطاء: منطقية، سوء فهم، heuristic خاطئ، حلقة لا نهائية.

---

### سؤال تصحيح 1 — خطأ منطقي في BFS (logic)

**الكود التالي يحتوي خطأ:**
```text
function BFS(problem)
  fringe ← LIFO-STACK(MAKE-NODE(INITIAL-STATE[problem]))  // ERROR
  loop do
    if fringe is empty then return failure
    node ← REMOVE-FRONT(fringe)
    if GOAL-TEST(problem, STATE(node)) then return node
    fringe ← INSERT-ALL(EXPAND(node, problem), fringe)
```

**اكتشف الخطأ:** يستخدم `LIFO-STACK` بدل `FIFO-QUEUE` — هذا يحوّله لـ DFS لا BFS.

**التصحيح:**
```text
function BFS(problem)
  fringe ← FIFO-QUEUE(MAKE-NODE(INITIAL-STATE[problem]))  // FIXED: FIFO not LIFO
  loop do
    if fringe is empty then return failure
    node ← REMOVE-FRONT(fringe)
    if GOAL-TEST(problem, STATE(node)) then return node
    fringe ← INSERT-ALL-TO-END(EXPAND(node, problem), fringe)  // FIXED: add to end
```

**شرح الحل:**
1. `FIFO-QUEUE` يضمن معالجة العقد بترتيب الوصول → الأضحل أولاً.
2. `INSERT-ALL-TO-END` يضيف الأبناء لنهاية القائمة → يبقى المستوى الحالي يُعالَج أولاً.
3. استخدام LIFO يجعل الخوارزمية تعمل كـDFS وتنتج نتائج مختلفة.

---

### سؤال تصحيح 2 — حلقة لا نهائية في DFS (infinite_loop)

**الكود التالي يحتوي خطأ:**
```text
function DFS(problem)
  fringe ← LIFO-STACK(MAKE-NODE(INITIAL-STATE[problem]))
  loop do
    if fringe is empty then return failure
    node ← REMOVE-FRONT(fringe)
    if GOAL-TEST(problem, STATE(node)) then return node
    fringe ← INSERT-ALL(EXPAND(node, problem), fringe)
    // Missing: no check for repeated states!
```

**اكتشف الخطأ:** لا يوجد فحص للحالات المكررة على المسار → في الرسوم البيانية ذات الحلقات سيدور الكود إلى الأبد.

**التصحيح:**
```text
function DFS(problem)
  fringe ← LIFO-STACK(MAKE-NODE(INITIAL-STATE[problem]))
  explored ← empty set                                    // ADDED: track visited states
  loop do
    if fringe is empty then return failure
    node ← REMOVE-FRONT(fringe)
    if GOAL-TEST(problem, STATE(node)) then return node
    if STATE(node) not in explored then                   // ADDED: avoid revisiting
      add STATE(node) to explored
      fringe ← INSERT-ALL(EXPAND(node, problem), fringe)
```

**شرح الحل:**
1. `explored set` يتتبع الحالات التي زُرناها مسبقاً.
2. `if STATE(node) not in explored` يمنع إعادة توسيع نفس الحالة.
3. بدون هذا الفحص، قد يعود DFS لـ Arad من Zerind ثم لـ Zerind من Arad... إلى ما لا نهاية.

---

### سؤال تصحيح 3 — سوء فهم في UCS (misconception)

**الكود التالي يحتوي خطأ:**
```text
function UCS(problem)
  fringe ← PRIORITY-QUEUE ordered by DEPTH, lowest first  // ERROR
  INSERT(MAKE-NODE(INITIAL-STATE[problem]), fringe)
  loop do
    if fringe is empty then return failure
    node ← REMOVE-MIN(fringe)
    if GOAL-TEST(problem, STATE(node)) then return node
    fringe ← INSERT-ALL(EXPAND(node, problem), fringe)
```

**اكتشف الخطأ:** `ordered by DEPTH` خاطئ — UCS يرتّب بـ`PATH-COST` ($g(n)$) لا العمق (العمق هو معيار BFS).

**التصحيح:**
```text
function UCS(problem)
  fringe ← PRIORITY-QUEUE ordered by PATH-COST, lowest first  // FIXED
  INSERT(MAKE-NODE(INITIAL-STATE[problem]), fringe)
  loop do
    if fringe is empty then return failure
    node ← REMOVE-MIN(fringe)
    if GOAL-TEST(problem, STATE(node)) then return node
    fringe ← INSERT-ALL(EXPAND(node, problem), fringe)
```

**شرح الحل:**
1. UCS يُعرَّف بـ"توسيع العقدة ذات أقل `g(n)`".
2. الترتيب بالعمق يحوّله لـBFS.
3. الفرق: عمق = عدد الخطوات، `g(n)` = مجموع التكاليف — في رومانيا هما مختلفان.

---

### سؤال تصحيح 4 — خطأ في DLS (logic)

**الكود التالي يحتوي خطأ:**
```text
function RECURSIVE-DLS(node, problem, limit)
  cutoff-occurred? ← false
  if GOAL-TEST(problem, STATE[node]) then return node
  else if DEPTH[node] = limit then return failure       // ERROR: should be cutoff
  else for each successor in EXPAND(node, problem) do
    result ← RECURSIVE-DLS(successor, problem, limit)
    if result = cutoff then cutoff-occurred? ← true
    else if result ≠ failure then return result
  if cutoff-occurred? then return cutoff else return failure
```

**اكتشف الخطأ:** السطر `return failure` عند `DEPTH[node] = limit` خاطئ — يجب إرجاع `cutoff` لا `failure`.

**التصحيح:**
```text
  else if DEPTH[node] = limit then return cutoff        // FIXED: cutoff not failure
```

**شرح الحل:**
1. `failure` يعني "لا حل موجود في هذا الفرع أبداً".
2. `cutoff` يعني "وصلنا للحد، الحل ربما موجود لكن أعمق".
3. الخلط بينهما يجعل IDS يتوقف مبكراً ظاناً أنه لا حل.

---

### سؤال تصحيح 5 — خطأ في IDS (misconception)

**الكود التالي يحتوي خطأ:**
```text
function ITERATIVE-DEEPENING-SEARCH(problem)
  for depth ← 1 to ∞ do                   // ERROR: starts at 1 not 0
    result ← DEPTH-LIMITED-SEARCH(problem, depth)
    if result ≠ cutoff then return result
  end
```

**اكتشف الخطأ:** يبدأ من `depth=1` بدل `depth=0` — يفوّت حالة الحل في العمق 0 (الجذر هو الهدف).

**التصحيح:**
```text
function ITERATIVE-DEEPENING-SEARCH(problem)
  for depth ← 0 to ∞ do                   // FIXED: start from 0
    result ← DEPTH-LIMITED-SEARCH(problem, depth)
    if result ≠ cutoff then return result
  end
```

**شرح الحل:**
1. إذا كانت الحالة الابتدائية هي الهدف نفسها، يجب إرجاع الحل عند depth=0.
2. البدء من 1 يخطئ هذه الحالة.
3. في المحاضرة: `for depth ← 0 to ∞`.

---

### سؤال تصحيح 6 — خطأ في EXPAND (logic)

**الكود التالي يحتوي خطأ:**
```text
function EXPAND(node, problem)
  successors ← the empty set
  for each action, result in SUCCESSOR-FN(problem, STATE[node]) do
    s ← a new NODE
    PARENT-NODE[s] ← node
    ACTION[s] ← action
    STATE[s] ← result
    PATH-COST[s] ← PATH-COST[node]          // ERROR: missing step cost
    DEPTH[s] ← DEPTH[node] + 1
    add s to successors
  return successors
```

**اكتشف الخطأ:** `PATH-COST[s] ← PATH-COST[node]` لا يضيف تكلفة الخطوة الجديدة.

**التصحيح:**
```text
    PATH-COST[s] ← PATH-COST[node] + STEP-COST(node, action, s)  // FIXED
```

**شرح الحل:**
1. تكلفة المسار للابن = تكلفة الأب + تكلفة الخطوة الجديدة.
2. بدون الإضافة، كل العقد ستظهر بنفس تكلفة الجذر → UCS لن يعمل صحيحاً.
3. `STEP-COST(node, action, s)` يحسب $c(x, a, y)$.

---

## الجزء الرابع: تمارين تطبيقية

> **هذه تمارين إضافية من إعداد الدليل للتدريب** — ليست في المحاضرة الأصلية.

---

### تمرين 1: صياغة مسألة بحث — fill_gaps

**السيناريو / المطلوب:**
مسألة "المزارع والذئب والماعز والكرنب" (Farmer-Wolf-Goat-Cabbage). المزارع يريد عبور نهر بقارب يحمل شخصاً واحداً إضافياً. قاعدة: الذئب يأكل الماعز والماعز يأكل الكرنب إذا تُرك دون المزارع.

**المطلوب:**
1. حدّد الـ`Initial State`.
2. حدّد الـ`Goal State`.
3. ما هي `Actions` الممكنة؟
4. ما الـ`Goal Test`؟
5. ما الـ`Path Cost`؟

**نموذج الحل:**
1. **Initial State:** {المزارع=يسار، ذئب=يسار، ماعز=يسار، كرنب=يسار}
2. **Goal State:** {المزارع=يمين، ذئب=يمين، ماعز=يمين، كرنب=يمين}
3. **Actions:** المزارع يعبر وحده | يعبر مع الذئب | يعبر مع الماعز | يعبر مع الكرنب (في الاتجاهين)
4. **Goal Test:** كل الأربعة في الضفة اليمنى
5. **Path Cost:** 1 لكل رحلة عبور

---

### تمرين 2: تتبع BFS — search_trace

**السيناريو:**
رسم بياني: A→B(1)، A→C(4)، B→D(2)، B→E(5)، C→F(1). الهدف F.

**المطلوب:**
1. تتبّع BFS وأعطِ ترتيب توسيع العقد.
2. هل النتيجة مثلى؟

**نموذج الحل:**
1. ترتيب BFS: A، B، C، D، E، F (تجاهل التكاليف — الأضحل أولاً)
2. مسار BFS: A→C→F (خطوتان) — لكن تكلفته 4+1=5. المسار الأمثل: A→B→... ليس هناك مسار أقصر لـF مباشرة. BFS يجد F عبر C لأنها نفس العمق مع B. لكن التكلفة 5 وليس الأقل — **غير مثلى** عند التكاليف المختلفة.

---

### تمرين 3: تتبع UCS — search_trace

**السيناريو:** نفس الرسم البياني أعلاه.

**المطلوب:**
1. تتبّع UCS وأعطِ ترتيب توسيع العقد.
2. ما المسار الأمثل وتكلفته؟

**نموذج الحل:**

| الخطوة | العقدة المُزالة | g(n) | fringe بعد التوسيع |
| --- | --- | --- | --- |
| 1 | A | 0 | {B(1), C(4)} |
| 2 | B | 1 | {C(4), D(3), E(6)} |
| 3 | D | 3 | {C(4), E(6)} |
| 4 | C | 4 | {E(6), F(5)} |
| 5 | F | 5 | — |

**المسار الأمثل:** A→C→F بتكلفة 5 (أو A→B→...→F إن وُجد). هنا F يُوجَد عبر C بتكلفة 5.

---

### تمرين 4: مقارنة IDS و BFS — scenario

**السيناريو:**
شجرة بـ b=3، d=4 (الحل في المستوى 4).

**المطلوب:**
1. احسب $N(\text{IDS})$.
2. احسب $N(\text{BFS})$.
3. قارن الفرق.

**نموذج الحل:**
$$N(\text{IDS}) = (4+1)\cdot 3^0 + 4\cdot 3^1 + 3\cdot 3^2 + 2\cdot 3^3 + 1\cdot 3^4 = 5 + 12 + 27 + 54 + 81 = 179$$

$$N(\text{BFS}) = 3^0 + 3^1 + 3^2 + 3^3 + 3^4 + 3\cdot(3^4 - 1) = 1+3+9+27+81+240 = 361$$

**الفرق:** IDS أنجز العمل بـ179 عقدة مقابل 361 لـBFS — نصف العمل تقريباً!

---

### تمرين 5: اكتشاف نوع الخطأ — code_fix

**الكود التالي:**
```text
function UCS(problem)
  fringe ← FIFO-QUEUE(MAKE-NODE(INITIAL-STATE[problem]))
  loop do
    if fringe is empty then return failure
    node ← REMOVE-FRONT(fringe)
    if GOAL-TEST(problem, STATE(node)) then return node
    fringe ← INSERT-ALL(EXPAND(node, problem), fringe)
```

**المطلوب:** ما نوع الخطأ وكيف تصحّحه؟

**نموذج الحل:**
- **الخطأ:** `FIFO-QUEUE` وإضافة بلا ترتيب — هذا BFS لا UCS.
- **التصحيح:** استبدل `FIFO-QUEUE` بـ`PRIORITY-QUEUE ordered by PATH-COST` وتأكد من ترتيب الإدراج.
- **نوع الخطأ:** `misconception` — خلط UCS مع BFS.

---

### تمرين 6: هيكل Node — fill_gaps

**المطلوب:** أكمل الجدول التالي لعقدة في شجرة BFS بعد توسيع Arad في مسألة رومانيا:

| الحقل | القيمة للعقدة Zerind |
| --- | --- |
| `STATE` | ؟ |
| `PARENT-NODE` | ؟ |
| `ACTION` | ؟ |
| `PATH-COST` | ؟ |
| `DEPTH` | ؟ |

**نموذج الحل:**

| الحقل | القيمة |
| --- | --- |
| `STATE` | Zerind |
| `PARENT-NODE` | عقدة Arad |
| `ACTION` | "Arad → Zerind" |
| `PATH-COST` | 75 (المسافة بين Arad وZerind) |
| `DEPTH` | 1 |

---

## الجزء الرابع: تمارين تحليل وتطبيق (إضافية — من إعداد الدليل)

> تمارين تحليلية إضافية — جداول ناقصة، إكمال أشجار بحث.

---

### تمرين تحليل 1: إكمال جدول Frontier/Closed لـ BFS — table_fill

**السيناريو:**
الرسم البياني: A→{B, C, D}، B→{E, F}، الهدف F.

**المطلوب:** أكمل جدول تتبع BFS:

| الخطوة | العقدة الحالية | Fringe قبل | Fringe بعد |
| --- | --- | --- | --- |
| 1 | ؟ | {A} | ؟ |
| 2 | ؟ | ؟ | ؟ |
| 3 | ؟ | ؟ | ؟ |
| 4 | ؟ | ؟ | ؟ |

**نموذج الحل:**

| الخطوة | العقدة الحالية | Fringe قبل | Fringe بعد |
| --- | --- | --- | --- |
| 1 | A | {A} | {B, C, D} |
| 2 | B | {B, C, D} | {C, D, E, F} |
| 3 | C | {C, D, E, F} | {D, E, F} (C بلا أبناء) |
| 4 | D | {D, E, F} | {E, F} (D بلا أبناء) |
| 5 | E | {E, F} | {F} |
| 6 | F | {F} | **GOAL FOUND!** |

---

### تمرين تحليل 2: heuristic_eval — مقارنة مسارات

**السيناريو:**
في مسألة رومانيا من Arad لـ Bucharest، هناك مسارات:
- مسار 1: Arad → Sibiu → Fagaras → Bucharest (تكاليف: 140+99+211 = **450**)
- مسار 2: Arad → Sibiu → Rimnicu Vilcea → Pitesti → Bucharest (تكاليف: 140+80+97+101 = **418**)
- مسار 3: Arad → Zerind → Oradea → Sibiu → Fagaras → Bucharest (تكاليف: 75+71+151+99+211 = **607**)

**المطلوب:**
1. أي مسار يختاره UCS؟
2. أي مسار تجده BFS أولاً؟

**نموذج الحل:**
1. **UCS** يختار **مسار 2** (تكلفة 418 = الأقل).
2. **BFS** يجد أول مسار بأقل عدد خطوات = مسار 1 أو 2 (كلاهما 3 خطوات من Sibiu — يعتمد على الترتيب). لكن BFS لا يضمن الأمثل بالتكلفة.

---

### تمرين تحليل 3: diagram_completion — إكمال شجرة IDS

**السيناريو:**
شجرة: الجذر A، أبناؤه B(يسار) وC(يمين)، أبناء B: D وE، أبناء C: F وG. الهدف G.

**المطلوب:** ارسم العقد التي تُوسَّع في IDS عند l=2 بترتيب DFS.

**نموذج الحل:**
ترتيب التوسيع عند l=2: A → B → D (cutoff) → E (cutoff) → C → F (not goal) → G (**GOAL FOUND**)

```
A (expanded)
├── B (expanded)
│   ├── D (cutoff: depth=2)
│   └── E (cutoff: depth=2)
└── C (expanded)
    ├── F (not goal, depth=2)
    └── G ← GOAL ✓
```

---

### تمرين تحليل 4: written_analysis — متى نختار أي خوارزمية؟

**المطلوب:** لكل سيناريو، اختر الخوارزمية الأنسب وبرّر:

1. مسألة 8-puzzle، نريد الحل الأمثل، ذاكرة محدودة.
2. بحث في شجرة لانهائية المحتمل، نريد أسرع حل.
3. خريطة بتكاليف مختلفة، نريد أقل تكلفة.
4. مسألة بعمق معروف d=10.

**نموذج الحل:**
1. **IDS** — يجد الأمثل (عند تكلفة=1) ومساحة خطية.
2. **IDS أو BFS** — BFS للشجرة المنتهية، IDS إذا الذاكرة محدودة.
3. **UCS** — يضمن الأمثل بتكاليف مختلفة.
4. **DLS بحد=10** أو **IDS** — DLS إذا d معروف بدقة.

---

## الجزء الرابع: تمارين تتبع الخوارزميات (خطوة بخطوة)

---

### تمرين تتبع 1: BFS

**المدخل:**
```text
رسم بياني:
A → B (cost=1), A → C (cost=5)
B → D (cost=2), B → E (cost=3)
C → F (cost=1)
الهدف: F
```

**أكمل الجدول:**

| الخطوة | العقدة الحالية | Fringe بعد التوسيع |
| --- | --- | --- |
| 1 | ؟ | ؟ |
| 2 | ؟ | ؟ |
| 3 | ؟ | ؟ |
| 4 | ؟ | ؟ |

**نموذج الحل:**

| الخطوة | العقدة الحالية | Fringe بعد التوسيع |
| --- | --- | --- |
| 1 | A | {B, C} |
| 2 | B | {C, D, E} |
| 3 | C | {D, E, F} |
| 4 | D | {E, F} |
| 5 | E | {F} |
| 6 | F | **GOAL!** |

**النتيجة:** مسار A→C→F (3 عقد، 2 خطوات). BFS يجد الأضحل.

**MCQ على هذا التتبع:**
- **Q:** ما العقدة التي تُوسَّع في الخطوة 3؟
  - أ) B  ب) C  ج) D  د) E  **← الإجابة: ب**

---

### تمرين تتبع 2: UCS

**المدخل:** نفس الرسم البياني.

**أكمل الجدول:**

| الخطوة | العقدة | g(n) | Fringe (مرتب) |
| --- | --- | --- | --- |
| 1 | ؟ | ؟ | ؟ |
| 2 | ؟ | ؟ | ؟ |
| 3 | ؟ | ؟ | ؟ |

**نموذج الحل:**

| الخطوة | العقدة | g(n) | Fringe بعد |
| --- | --- | --- | --- |
| 1 | A | 0 | {B(1), C(5)} |
| 2 | B | 1 | {D(3), C(5), E(4)} |
| 3 | D | 3 | {E(4), C(5)} |
| 4 | E | 4 | {C(5)} |
| 5 | C | 5 | {F(6)} |
| 6 | F | 6 | **GOAL!** |

**النتيجة:** مسار A→C→F بتكلفة 6.

**MCQ:** ما أول عقدة تُزال من fringe بعد توسيع A؟  **B(g=1)**

---

### تمرين تتبع 3: DFS

**المدخل:** نفس الرسم البياني، الأبناء تُضاف بالترتيب الأبجدي.

**نموذج الحل:**
ترتيب توسيع DFS: A → B → D (لا أبناء) → E (لا أبناء) → C → F (**GOAL**)

**المسار:** A→C→F

---

### تمرين تتبع 4: IDS

**المدخل:** شجرة b=2، d=2. الجذر A، أبناؤه B وC. أبناء B: D وE. أبناء C: F وG. الهدف G.

**تتبع بالحدود 0، 1، 2:**

**l=0:** A فقط (cutoff)
**l=1:** A → B (cutoff) → C (cutoff) → نتيجة: cutoff
**l=2:** A → B → D (cutoff) → E (cutoff) → C → F (لا هدف) → G (**GOAL**)

**النتيجة:** الحل A→C→G وجد عند l=2.

---

## الجزء الرابع: أسئلة تصميم

---

### سؤال تصميم 1: تصميم State Space لمسألة — uml_design

**المطلوب:**
صمّم `State Space Graph` لمسألة 3-puzzle (لوحة 2×2 بها أرقام 1,2,3 وفراغ).

**نموذج الإجابة:**

```
State: (pos_blank, pos_1, pos_2, pos_3)
Initial State: مثلاً [1,2; 3,_]
Goal State: [1,2; 3,_] — أي ترتيب مطلوب

Actions: تحريك الفراغ {Left, Right, Up, Down}
Branching Factor: max 2-3 حسب موقع الفراغ

عدد الحالات: 4!/2 = 12 حالة ممكنة
```

```diagram
type: flowchart
title: 3-Puzzle Partial State Space
direction: TD
nodes:
  - id: s1
    label: "[1,2;3,_]"
    kind: process
  - id: s2
    label: "[1,2;_,3]"
    kind: process
  - id: s3
    label: "[1,_;3,2]"
    kind: process
  - id: s4
    label: "[_,2;1,3]"
    kind: process
edges:
  - from: s1
    to: s2
    label: Left
  - from: s2
    to: s1
    label: Right
  - from: s1
    to: s3
    label: Up
  - from: s2
    to: s4
    label: Up
```

**معايير التقييم:**
- تحديد عدد الحالات الصحيح.
- تمثيل الإجراءات ثنائية الاتجاه.
- تحديد Initial State و Goal State بوضوح.

---

### سؤال تصميم 2: تصميم وكيل PEAS + خوارزمية بحث — architecture

**المطلوب:**
صمّم نظام `Problem-Solving Agent` لحل 8-puzzle تلقائياً. حدّد PEAS ثم اختر خوارزمية البحث المناسبة وبرّر.

**نموذج الإجابة:**

| PEAS | القيمة |
| --- | --- |
| **P**erformance | عدد الحركات للوصول للهدف (أقل = أفضل) |
| **E**nvironment | لوحة 3×3 محددة، deterministic، fully observable |
| **A**ctuators | تحريك الفراغ (يسار/يمين/أعلى/أسفل) |
| **S**ensors | رؤية اللوحة الكاملة |

**الخوارزمية المختارة:** IDS (أو A* مع heuristic Manhattan Distance لو تعلّمنا Informed Search)

**المبرر:** IDS يضمن الأمثل (بتكلفة=1/حركة) ومساحة خطية $O(bd)$ — مثالي للـ8-puzzle.

**معايير التقييم:**
- تعريف PEAS كامل.
- تبرير اختيار الخوارزمية.
- ذكر مساوئ الاختيار.

---

## الجزء الرابع: بطاقات سؤال وجواب (Q&A Cards)

---

**Q1:** ما الفرق بين `Offline Solving` و`Online Solving`؟
**A:** Offline = يخطط الحل كاملاً قبل التنفيذ. Online = يتصرف بدون معرفة كاملة أثناء التنفيذ.

---

**Q2:** ما عناصر `Single-State Problem Formulation`؟
**A:** أربعة: Initial State، Successor Function، Goal Test، Path Cost.

---

**Q3:** ما الفرق بين `State` و`Node`؟
**A:** State = تمثيل للتهيئة الفيزيائية. Node = بنية بيانات تضم State + Parent + Action + Depth + g(x).

---

**Q4:** ما هو `Fringe` في خوارزميات البحث؟
**A:** قائمة العُقد المنتظرة للتوسيع. نوعه (FIFO/LIFO/Priority) يحدد الخوارزمية.

---

**Q5:** لماذا BFS غير مثلى عموماً؟
**A:** لأنه يجد الحل الأقل خطوات لا الأقل تكلفة — مثلى فقط إذا التكاليف متساوية.

---

**Q6:** ما ميزة DFS الرئيسية على BFS؟
**A:** مساحة الذاكرة خطية $O(bm)$ بدل أسية $O(b^{d+1})$.

---

**Q7:** لماذا DFS غير مكتمل؟
**A:** قد يدور في حلقات لانهائية أو يتعمق في فرع لانهائي دون رجوع.

---

**Q8:** ما الفرق بين `cutoff` و`failure` في DLS؟
**A:** cutoff = وصل للحد قبل الهدف (الحل ربما موجود أعمق). failure = لا حل موجود في هذا الفرع.

---

**Q9:** لماذا IDS يُعتبر الأفضل في Uninformed Search؟
**A:** يجمع اكتمال BFS + optimality + مساحة DFS الخطية $O(bd)$.

---

**Q10:** ما بنية `fringe` في كل خوارزمية؟
**A:** BFS = FIFO Queue | DFS = LIFO Stack | UCS = Priority Queue (بـg(n)) | IDS = Stack داخل DLS.

---

**Q11:** متى يكون UCS مكتملاً؟
**A:** إذا كانت تكلفة الخطوة $\geq \epsilon > 0$ — يمنع الحلقات ذات التكلفة الصفرية.

---

**Q12:** كيف نحسب Path Cost في EXPAND؟
**A:** `PATH-COST[s] = PATH-COST[node] + STEP-COST(node, action, s)` — تراكمي.

---

**Q13:** ما تعقيد IDS الزمني؟
**A:** $O(b^d)$ — رغم إعادة التوسيع لأن معظم العمل في المستوى الأخير.

---

**Q14:** ما المقصود بـ`Branching Factor b`؟
**A:** العدد الأقصى لأبناء أي عقدة في شجرة البحث.

---

**Q15:** متى يكون BFS مثلى؟
**A:** إذا كانت تكلفة كل خطوة = 1 (أو متساوية) — فالأضحل = الأقل تكلفة.

---

**Q16:** ما هي `Successor Function` S(x)؟
**A:** تُرجع مجموعة من أزواج (إجراء، حالة) الممكنة من الحالة x.

---

**Q17:** ما مشكلة BFS الأساسية؟
**A:** مساحة الذاكرة الأسية $O(b^{d+1})$ — يحتفظ بكل عقدة في الذاكرة.

---

**Q18:** كيف نجعل DFS مكتملاً؟
**A:** بتجنب الحالات المكررة على المسار (`avoid repeated states along path`) → مكتمل في الفضاءات المنتهية.

---

**Q19:** ما مثال `goal test` ضمني؟
**A:** `NoDirt(x)` في مسألة المكنسة — نختبر خاصية الحالة لا مطابقتها لحالة محددة.

---

**Q20:** ما الفرق بين `BFS` و`UCS` عند التكاليف المتساوية؟
**A:** متطابقان تماماً — UCS هو تعميم BFS.

---

## الجزء الخامس: الخوارزميات الكاملة (مرجع Pseudocode)

> مرجع pseudocode كامل — بدون شرح جديد. كل خوارزمية في كتلة مستقلة.

---

```text
// ========================================
// BFS — Breadth-First Search
// ========================================
function BFS(problem) returns solution or failure
  fringe ← FIFO-QUEUE containing MAKE-NODE(INITIAL-STATE[problem])
  loop do
    if fringe is empty then return failure
    node ← REMOVE-FRONT(fringe)
    if GOAL-TEST(problem, STATE(node)) then return node
    fringe ← INSERT-ALL(EXPAND(node, problem), END-OF(fringe))
```

---

```text
// ========================================
// DFS — Depth-First Search
// ========================================
function DFS(problem) returns solution or failure
  fringe ← LIFO-STACK containing MAKE-NODE(INITIAL-STATE[problem])
  loop do
    if fringe is empty then return failure
    node ← REMOVE-FRONT(fringe)
    if GOAL-TEST(problem, STATE(node)) then return node
    fringe ← INSERT-ALL(EXPAND(node, problem), FRONT-OF(fringe))
```

---

```text
// ========================================
// UCS — Uniform-Cost Search
// ========================================
function UCS(problem) returns solution or failure
  fringe ← PRIORITY-QUEUE ordered by g(n) ascending
  INSERT(MAKE-NODE(INITIAL-STATE[problem]), fringe)
  loop do
    if fringe is empty then return failure
    node ← REMOVE-MIN(fringe)
    if GOAL-TEST(problem, STATE(node)) then return node
    fringe ← INSERT-ALL-SORTED(EXPAND(node, problem), fringe)
```

---

```text
// ========================================
// DLS — Depth-Limited Search
// ========================================
function DEPTH-LIMITED-SEARCH(problem, limit) returns soln/fail/cutoff
  return RECURSIVE-DLS(MAKE-NODE(INITIAL-STATE[problem]), problem, limit)

function RECURSIVE-DLS(node, problem, limit) returns soln/fail/cutoff
  cutoff-occurred? ← false
  if GOAL-TEST(problem, STATE[node]) then return node
  else if DEPTH[node] = limit then return cutoff
  else for each successor in EXPAND(node, problem) do
    result ← RECURSIVE-DLS(successor, problem, limit)
    if result = cutoff then cutoff-occurred? ← true
    else if result ≠ failure then return result
  if cutoff-occurred? then return cutoff else return failure
```

---

```text
// ========================================
// IDS — Iterative Deepening Search
// ========================================
function ITERATIVE-DEEPENING-SEARCH(problem) returns solution
  for depth ← 0 to ∞ do
    result ← DEPTH-LIMITED-SEARCH(problem, depth)
    if result ≠ cutoff then return result
  end
```

---

```text
// ========================================
// EXPAND — Generate Successors
// ========================================
function EXPAND(node, problem) returns set of nodes
  successors ← empty set
  for each action, result in SUCCESSOR-FN(problem, STATE[node]) do
    s ← new NODE
    PARENT-NODE[s] ← node
    ACTION[s] ← action
    STATE[s] ← result
    PATH-COST[s] ← PATH-COST[node] + STEP-COST(node, action, s)
    DEPTH[s] ← DEPTH[node] + 1
    add s to successors
  return successors
```

---

```text
// ========================================
// Simple Problem-Solving Agent
// ========================================
function SIMPLE-PROBLEM-SOLVING-AGENT(percept) returns action
  static: seq ← [], state, goal ← null, problem
  state  ← UPDATE-STATE(state, percept)
  if seq is empty then
    goal    ← FORMULATE-GOAL(state)
    problem ← FORMULATE-PROBLEM(state, goal)
    seq     ← SEARCH(problem)
  action ← RECOMMENDATION(seq, state)
  seq    ← REMAINDER(seq, state)
  return action
```

---

## الجزء الخامس: أسئلة نظرية متوقعة بالامتحان

---

### السؤال 1: ما هي عناصر صياغة المسألة (Problem Formulation)؟
**نموذج الإجابة:**
1. **التعريف:** مسألة البحث تُعرَّف بأربعة عناصر.
2. **المكونات:** Initial State | Successor Function S(x) | Goal Test | Path Cost.
3. **مثال:** في رومانيا: Initial="Arad"، S(x)=الانتقالات بين المدن، GoalTest=x="Bucharest"، PathCost=مجموع المسافات.
4. **متى نستخدم:** عند تحويل مشكلة حقيقية لمسألة بحث رسمية.

---

### السؤال 2: قارن BFS و IDS
**نموذج الإجابة:**
1. **التعريف:** كلاهما خوارزميات uninformed مكتملة.
2. **المكونات/الشروط:**
   - BFS: FIFO، مساحة أسية، مثلى عند تكاليف متساوية.
   - IDS: DFS متكرر، مساحة خطية، مثلى عند تكاليف=1.
3. **مثال:** b=10, d=5: BFS≈1.1M عقدة، IDS≈123K عقدة.
4. **متى نستخدم:** IDS مفضّل عملياً لتوازنه الأفضل.

---

### السؤال 3: لماذا DFS غير مكتمل وكيف نصلح ذلك؟
**نموذج الإجابة:**
1. **التعريف:** الاكتمال = ضمان إيجاد الحل إذا وُجد.
2. **السبب:** DFS قد يدور في حلقات لانهائية أو ينزل في فرع ذي عمق لانهائي.
3. **الحل:** تجنّب تكرار الحالات على المسار → مكتمل في الفضاءات المنتهية.
4. **متى نستخدم:** DFS مفيد عندما المساحة محدودة والحل عميق.

---

### السؤال 4: ما الفرق بين cutoff و failure في DLS؟
**نموذج الإجابة:**
1. **cutoff:** وصلنا لحد العمق ولم نجد الهدف — الحل قد يكون موجوداً أعمق.
2. **failure:** لا حل موجود في هذا الفرع على الإطلاق.
3. **مثال:** DLS(limit=2) على مسألة هدفها عمق 4 → cutoff. مسألة بلا حل → failure.
4. **أهمية الفرق:** IDS يعتمد على cutoff لزيادة الحد.

---

### السؤال 5: ما مزايا وعيوب UCS؟
**نموذج الإجابة:**
1. **التعريف:** توسيع الأقل تكلفة أولاً.
2. **المزايا:** مثلى دائماً مع تكاليف مختلفة، مكتمل.
3. **العيوب:** قد يستكشف في الاتجاه "الخاطئ" إذا التكاليف منخفضة في اتجاه بعيد عن الهدف.
4. **متى نستخدم:** تكاليف مختلفة + نريد الأمثل.

---

### السؤال 6: ما هو State Space Graph وكيف يختلف عن Search Tree؟
**نموذج الإجابة:**
1. **State Space Graph:** رسم بياني لكل الحالات والانتقالات الممكنة — ثابت لا يتكرر.
2. **Search Tree:** الشجرة التي تنشئها خوارزمية البحث — قد تتكرر نفس الحالة بمسارات مختلفة.
3. **مثال:** في رومانيا: خريطة المدن = State Space Graph | الشجرة التي نبنيها أثناء BFS = Search Tree.
4. **أهمية:** Search Tree قد يكون أكبر بكثير من State Space Graph.

---

### السؤال 7: ما معايير تقييم استراتيجيات البحث؟
**نموذج الإجابة:**
1. **التعريف:** أربعة معايير لمقارنة الخوارزميات.
2. **المعايير:** Completeness | Time Complexity | Space Complexity | Optimality.
3. **مثال:** DFS: لا، O(b^m)، O(bm)، لا — مع تبيان لماذا.
4. **متى نستخدم:** عند اختيار الخوارزمية المناسبة للمسألة.

---

### السؤال 8: ما هي uninformed search strategies ولماذا تسمى كذلك؟
**نموذج الإجابة:**
1. **التعريف:** خوارزميات تعتمد فقط على تعريف المسألة.
2. **المكونات:** BFS، DFS، UCS، DLS، IDS.
3. **لماذا uninformed:** لا تعرف أين الهدف — لا تقدير للمسافة (لا heuristic).
4. **متى نستخدم:** عندما لا تتوفر معلومات إضافية عن موقع الهدف.

---

### السؤال 9: اشرح كيف يعمل IDS وبرّر كفاءته
**نموذج الإجابة:**
1. **التعريف:** تشغيل DLS بحدود متزايدة من 0 حتى إيجاد الحل.
2. **الكفاءة:** $O(b^d)$ لأن معظم العمل في آخر تكرار.
3. **مثال:** b=10, d=5: N(IDS)=123,450 مقابل N(BFS)=1,111,100.
4. **متى نستخدم:** المسائل الكبيرة حيث الذاكرة محدودة ونريد الأمثل.

---

### السؤال 10: ما دور EXPAND في خوارزميات البحث؟
**نموذج الإجابة:**
1. **التعريف:** EXPAND تولّد كل العقد الابنة لعقدة محددة.
2. **المكونات:** تستخدم SUCCESSOR-FN، تحسب PATH-COST تراكمياً، تضبط DEPTH.
3. **مثال:** EXPAND(Arad) → {Zerind(g=75), Sibiu(g=140), Timisoara(g=118)}.
4. **متى نستخدم:** في كل خطوة توسيع بأي خوارزمية بحث.

---

## الجزء السادس: قائمة فحص ذاتي قبل الامتحان ✅

- [ ] أعرف تعريف `Problem-Solving Agent` والفرق بين offline وonline.
- [ ] أستطيع صياغة أي مسألة بحث (4 عناصر) بدون مراجعة.
- [ ] أعرف الفرق الجوهري بين `State` و`Node`.
- [ ] أفهم دور `fringe` وكيف يختلف بين BFS/DFS/UCS.
- [ ] أستطيع تتبّع BFS خطوة بخطوة وإنتاج ترتيب التوسيع.
- [ ] أستطيع تتبّع DFS وأفهم لماذا يتراجع.
- [ ] أفهم لماذا UCS يستخدم Priority Queue لا FIFO.
- [ ] أعرف الفرق بين `cutoff` و`failure` في DLS.
- [ ] أستطيع شرح لماذا IDS مثلى رغم إعادة التوسيع.
- [ ] أحفظ جدول المقارنة: Complete/Time/Space/Optimal للخوارزميات الخمس.
- [ ] أعرف معادلة تعقيد BFS: $O(b^{d+1})$ والمقصود بـ$b$ و$d$.
- [ ] أعرف معادلة تعقيد IDS: $O(b^d)$ وكيف تختلف عن BFS.
- [ ] أستطيع كتابة pseudocode BFS من الذاكرة.
- [ ] أستطيع كتابة pseudocode IDS من الذاكرة.
- [ ] أفهم لماذا DFS ليس optimal ولا complete.
- [ ] أعرف مثال Vacuum World كاملاً (states, actions, goal, cost).
- [ ] أعرف مثال 8-puzzle كاملاً وأنه NP-hard.
- [ ] أستطيع تحديد الخوارزمية المناسبة لأي سيناريو.
- [ ] راجعت أخطاء pseudocode الشائعة (LIFO/FIFO، cutoff/failure، g(n)/depth).
- [ ] حللت على الأقل تمرين تتبع كامل لكل خوارزمية.

---

## الجزء السادس: ورقة المراجعة السريعة (Cheat Sheet)

---

### 🔑 خريطة العلاقات بين المحاضرات

| المحاضرة | ترتبط مع | كيف؟ |
| --- | --- | --- |
| Intelligent Agents | Problem Solving | Problem-Solving Agent = تخصيص للوكيل العام |
| Problem Solving & Search | Informed Search (A*) | A* يضيف heuristic لـ UCS |
| Problem Solving & Search | Game Playing (Minimax) | Minimax = بحث في شجرة اللعبة |
| Problem Solving & Search | Local Search | Hill Climbing بديل للبحث الكامل |

---

### 🔑 أهم النقاط الذهبية

| الموضوع | النقاط |
| --- | --- |
| BFS | مكتمل، مثلى (تكاليف=1)، مساحة أسية = المشكلة |
| DFS | مساحة خطية = الميزة، غير مكتمل = العيب |
| UCS | مثلى دائماً، يعمّم BFS |
| IDS | أفضل توازن عملي = اختره غالباً |
| Formulation | 4 عناصر = Initial + Successor + GoalTest + PathCost |
| State vs Node | Node = State + تاريخ |

---

### 🔑 مرجع سريع

| الرمز/المصطلح | المعنى | يُستخدم في |
| --- | --- | --- |
| $b$ | Branching Factor (عامل التفرع) | تعقيد كل الخوارزميات |
| $d$ | عمق الحل الأمثل | BFS، IDS |
| $m$ | أقصى عمق | DFS، DLS |
| $g(n)$ | تكلفة المسار من الجذر لـn | UCS، A* |
| $c(x,a,y)$ | تكلفة الخطوة | EXPAND |
| $C^*$ | تكلفة الحل الأمثل | UCS complexity |
| $\epsilon$ | أقل تكلفة ممكنة | UCS completeness |
| `fringe` | قائمة العُقد المنتظرة | كل الخوارزميات |
| `cutoff` | وصل للحد قبل الهدف | DLS، IDS |
| `FIFO` | First In First Out | BFS |
| `LIFO` | Last In First Out | DFS |

---

### 🔑 قواعد ذهبية لا تُنسى

| # | القاعدة |
| --- | --- |
| 1 | **IDS = BFS completeness + DFS space** — اختره افتراضياً |
| 2 | **UCS = BFS + تكاليف مختلفة** — عند تكاليف متساوية هما متطابقان |
| 3 | **DFS = مساحة خطية لكن غير مكتمل** — خطر في الحلقات |
| 4 | **cutoff ≠ failure** — cutoff يعني "ربما" لا "أبداً" |
| 5 | **State ≠ Node** — Node أغنى بالمعلومات |
| 6 | **fringe نوعه = الخوارزمية** — FIFO→BFS، LIFO→DFS، Priority→UCS |
| 7 | **BFS مثلى فقط عند تكاليف=1** — لا تعمّم |
| 8 | **n-Puzzle الأمثل NP-hard** — صعب حسابياً للأحجام الكبيرة |

---

<!-- VALIDATION
lecture: "Problem Solving and Search — Lecture 3"
sections_covered:
  - problem_solving_agent
  - problem_formulation
  - vacuum_world
  - 8_puzzle
  - robotic_assembly
  - tree_search
  - states_vs_nodes
  - search_strategies
  - uninformed_search
  - BFS
  - UCS
  - DFS
  - DLS
  - IDS
checklist:
  - mcq_count: 18 ✓
  - debug_count: 6 ✓
  - trace_exercises: 4 ✓
  - application_exercises: 6 ✓
  - analysis_exercises: 4 ✓
  - design_questions: 2 ✓
  - qa_cards: 20 ✓
  - theory_questions: 10 ✓
  - pseudocode_reference: 6 blocks ✓
  - analogy_count: 6 ✓
  - equations_with_explanation: 5 ✓
  - cheat_sheet: ✓
  - self_check: ✓
-->
