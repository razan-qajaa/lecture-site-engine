# المحاضرة 7 — Game Playing (لعب الألعاب)
> **المادة:** الذكاء الاصطناعي (القسم النظري) | **الموضوع:** `Minimax`، `Alpha-Beta Pruning`، أنواع الألعاب، `Utility`

---

## 📌 خريطة التكامل (أين تقع هذه المحاضرة في الدورة؟)

| المرحلة | الأدوات | المخرجات |
| --- | --- | --- |
| المحاضرات 1–2: Introduction + Agents | `Rational Agent`، `PEAS` | فهم البيئة والوكيل |
| المحاضرات 3–5: Problem Solving & Search | `BFS`، `DFS`، `A*`، `IDS` | خوارزميات البحث الكلاسيكية |
| المحاضرة 6: Local Search | `Hill Climbing`، `Simulated Annealing` | بحث دون استكشاف كامل |
| **المحاضرة 7: Game Playing ← أنت هنا** | `Minimax`، `Alpha-Beta Pruning`، `Utility` | اتخاذ القرار الأمثل في البيئات التنافسية |
| المحاضرات 8–9: Logical Agent + FOL | `Propositional Logic`، `Resolution` | الاستنتاج المنطقي |
| المحاضرات 10+: Machine Learning | `Supervised`، `Gradient Descent` | التعلم من البيانات |

> **نوع هذه المحاضرة:** نظري + خوارزميات (`Minimax`، `Alpha-Beta`) + مخططات (شجرة اللعبة) + جداول (أنواع الألعاب)

---

## الجزء الأول: الشرح التفصيلي (سطر بسطر)

---

### 1. Games vs. Search Problems (الألعاب مقابل مسائل البحث)

#### النص الأصلي يقول:
> "Unpredictable opponent ⇒ solution is a strategy specifying a move for every possible opponent reply. Time limits ⇒ unlikely to find goal, must approximate."

#### الشرح المبسّط:
في مسائل البحث العادية (كإيجاد مسار)، الوكيل يتحكم في كل الخطوات. أما في الألعاب، يوجد **خصم** (`opponent`) يتصرف بشكل غير متوقع، لذا الحل ليس مساراً واحداً بل **استراتيجية** (`strategy`) كاملة تغطي كل رد محتمل من الخصم.

**لماذا؟** لأن الخصم قد يختار أي حركة، فنحتاج خطة لكل سيناريو ممكن.

#### 💡 التشبيه:
> مثل لاعب شطرنج لا يعرف ماذا سيفعل خصمه — لا يكفي أن يخطط لحركة واحدة، بل يجب أن يكون لديه رد جاهز لكل احتمال.
> **وجه الشبه:** خطة الوكيل = `strategy`، حركة الخصم = `opponent reply`

**الفهم الخاطئ الشائع ❌:** الألعاب تُحل بنفس طريقة `A*` أو `BFS`.
**الفهم الصحيح ✅:** الألعاب تحتاج `strategy` لا `path`، لأن الخصم يؤثر على النتيجة.

---

### 1.1. التاريخ — من فكّر في هذا أولاً؟

#### النص الأصلي يقول:
> - Computer considers possible lines of play (Babbage, 1846)
> - Algorithm for perfect play (Zermelo, 1912; Von Neumann, 1944)
> - Finite horizon, approximate evaluation (Zuse, 1945; Wiener, 1948; Shannon, 1950)
> - First chess program (Turing, 1951)
> - Machine learning to improve evaluation accuracy (Samuel, 1952–57)
> - Pruning to allow deeper search (McCarthy, 1956)

#### الشرح المبسّط:
تطور حل الألعاب عبر الزمن:

| السنة | الشخص | الإسهام |
| --- | --- | --- |
| 1846 | `Babbage` | فكرة أن الحاسوب يمكنه النظر في خطوط اللعب |
| 1912–1944 | `Zermelo`، `Von Neumann` | خوارزمية اللعب الكامل (أساس `Minimax`) |
| 1945–1950 | `Zuse`، `Wiener`، `Shannon` | التقييم التقريبي (`approximate evaluation`) لأفق محدود |
| 1951 | `Turing` | أول برنامج شطرنج |
| 1952–57 | `Samuel` | تحسين دقة التقييم بالتعلم الآلي |
| 1956 | `McCarthy` | تقليم الفروع (`pruning`) لتعميق البحث |

#### مهم للامتحان ⚠️:
> `Alpha-Beta Pruning` تعود في أصولها إلى `McCarthy` 1956، وهي تحسين على `Minimax` الأصلي.

---

### 2. Types of Games (أنواع الألعاب)

#### النص الأصلي يقول:
> جدول يصنّف الألعاب حسب: `deterministic` / `chance` و `perfect information` / `imperfect information`

#### الشرح المبسّط:
الألعاب تختلف في بُعدين:

1. **هل النتيجة محددة أم عشوائية؟** → `deterministic` vs `chance`
2. **هل كلا اللاعبين يرى كل شيء؟** → `perfect information` vs `imperfect information`

#### 📊 جدول أنواع الألعاب:

| | `deterministic` | `chance` (عشوائي) |
| --- | --- | --- |
| **`perfect information`** | شطرنج، داما، غو، أوثيلو | `backgammon`، مونوبولي |
| **`imperfect information`** | `battleships`، `blind tictactoe` | بريدج، بوكر، سكرابل، حرب نووية |

#### 💡 التشبيه:
> الشطرنج مثل المباراة في الملعب المفتوح — كل لاعب يرى كل القطع. البوكر مثل اللعب بأوراق مخفية — لا أحد يعرف أوراق الآخر.
> **وجه الشبه:** رؤية الحالة الكاملة = `perfect information`

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** لماذا `backgammon` يُصنَّف `chance` رغم أن اللاعبين يرون اللوح كاملاً؟
> **لماذا هذا مهم؟** لأن الزهر (`dice`) يضيف عشوائية — النتيجة ليست محددة بالحركات فقط.

---

### 3. Game Tree — شجرة اللعبة

#### النص الأصلي يقول:
> مخطط `Game tree (2-player, deterministic, turns)` — MAX (X) يبدأ، ثم MIN (O)، تتناوب الطبقات حتى `TERMINAL` مع قيم `Utility` = {-1, 0, +1}

#### الشرح المبسّط:
شجرة اللعبة (`game tree`) تمثّل **جميع الحالات الممكنة** للعبة:
- **الجذر** = الحالة الابتدائية
- **كل مستوى** = دور لاعب معين (MAX أو MIN)
- **الأوراق (terminal nodes)** = نهايات اللعبة مع قيمة `Utility`

#### 📊 المخطط: شجرة لعبة `Tic-Tac-Toe`

#### ما هذا المخطط؟
> يوضّح كيف تتفرع حالات لعبة X/O من الجذر الفارغ حتى نهايات اللعبة، مع تناوب طبقات MAX وMIN.

#### وصف العُقد:
| # | العُقدة | النوع `kind` | الشرح |
| --- | --- | --- | --- |
| 1 | اللوح الفارغ | `start` | الحالة الابتدائية |
| 2 | طبقة MAX (X) | `max_node` | X يختار أفضل حركة |
| 3 | طبقة MIN (O) | `min_node` | O يختار أسوأ حركة للخصم |
| 4 | `TERMINAL` | `leaf` | نهاية اللعبة |

#### وصف الروابط:
| من | إلى | التسمية | نوع السهم | الشرح |
| --- | --- | --- | --- | --- |
| جذر | طبقة MIN | حركة X | `solid` | كل حركة ممكنة لـ X |
| طبقة MIN | طبقة MAX | حركة O | `solid` | كل رد ممكن لـ O |
| آخر طبقة | `TERMINAL` | — | `solid` | انتهاء اللعبة |

```diagram
type: decision-tree
title: Game Tree (2-player Tic-Tac-Toe)
direction: TD
nodes:
  - id: root
    label: "اللوح الفارغ"
    kind: start
    level: 0
  - id: max1
    label: "MAX (X)"
    kind: max_node
    level: 1
  - id: min1
    label: "MIN (O)"
    kind: min_node
    level: 2
  - id: terminal
    label: "TERMINAL — Utility ∈ {-1, 0, +1}"
    kind: leaf
    level: n
edges:
  - from: root
    to: max1
  - from: max1
    to: min1
  - from: min1
    to: terminal
```

#### ملاحظة:
> `Utility = +1` تعني فوز MAX، `Utility = -1` تعني خسارته، `Utility = 0` تعادل.

---

### 4. Minimax — الخوارزمية الأساسية

#### النص الأصلي يقول:
> "Perfect play for deterministic, perfect-information games. Idea: choose move to position with highest minimax value = best achievable payoff against best play."

#### الشرح المبسّط:
`Minimax` هي استراتيجية اللعب المثالي:
- **MAX** يحاول **رفع** القيمة (`maximize`)
- **MIN** يحاول **خفض** القيمة (`minimize`)
- كل لاعب يفترض أن الآخر يلعب بشكل مثالي

#### 💡 التشبيه:
> مثل لاعبين في مفاوضة: أحدهم يريد أعلى سعر والآخر أقل سعر، وكلٌّ منهما يعرف أن الآخر عاقل ومثالي.
> **وجه الشبه:** MAX = البائع، MIN = المشتري، `Utility` = السعر النهائي

#### 📊 مثال على `Minimax` — لعبة 2-ply:

```
MAX (الجذر): يختار max(3, 2, 2) = 3 → يختار A₁
MIN (طبقة 2):
  - A₁ → min(3, 12, 8) = 3
  - A₂ → min(2, 4, 6) = 2
  - A₃ → min(14, 5, 2) = 2
```

#### 💻 الكود: `Minimax Algorithm`

#### ما هذا الكود؟
> يحدد أفضل حركة لـ MAX عبر استدعاء متبادل بين MAX-VALUE وMIN-VALUE حتى الوصول للأوراق.

```text
// MINIMAX-DECISION: returns the best action for MAX
function MINIMAX-DECISION(state):
    return action a in ACTIONS(state)
           that maximizes MIN-VALUE(RESULT(a, state))
           // choose the action leading to highest min-value

// MAX-VALUE: returns utility from MAX's perspective
function MAX-VALUE(state):
    if TERMINAL-TEST(state): return UTILITY(state)  // base case
    v ← -∞                                          // initialize worst case
    for each (a, s) in SUCCESSORS(state):
        v ← MAX(v, MIN-VALUE(s))                    // take best of children
    return v

// MIN-VALUE: returns utility from MIN's perspective
function MIN-VALUE(state):
    if TERMINAL-TEST(state): return UTILITY(state)  // base case
    v ← +∞                                          // initialize worst case for MIN
    for each (a, s) in SUCCESSORS(state):
        v ← MIN(v, MAX-VALUE(s))                    // take worst of children
    return v
```

#### شرح كل سطر:
1. `MINIMAX-DECISION(state)` → نقطة الدخول — تعيد الحركة الأفضل لـ MAX
2. `TERMINAL-TEST(state)` → تتحقق من انتهاء اللعبة (ورقة شجرة)
3. `v ← -∞` في MAX-VALUE → نبدأ بأسوأ قيمة لـ MAX لضمان التحديث
4. `v ← MAX(v, MIN-VALUE(s))` → MAX يبحث عن أكبر ما يحققه MIN في الفروع
5. `v ← +∞` في MIN-VALUE → نبدأ بأسوأ قيمة لـ MIN
6. `v ← MIN(v, MAX-VALUE(s))` → MIN يبحث عن أصغر ما يسمح به MAX

**الناتج المتوقع:**
> الحركة التي تقود MAX لأعلى `Utility` مفترضاً لعباً مثالياً من الطرفين.

---

### 5. Properties of Minimax (خصائص Minimax)

#### النص الأصلي يقول:
> Complete?? Yes, if tree is finite. Optimal?? Yes, against an optimal opponent. Time complexity?? O(bᵐ). Space complexity?? O(bm). For chess, b≈35, m≈100 ⇒ exact solution completely infeasible. But do we need to explore every path?

#### الشرح المبسّط:

| الخاصية | القيمة | الشرح |
| --- | --- | --- |
| `Complete` (اكتمال) | نعم — إذا كانت الشجرة محدودة | الشطرنج له قواعد تضمن ذلك |
| `Optimal` (مثالية) | نعم — ضد خصم مثالي | إذا كان الخصم يلعب بأخطاء، قد نجد ما هو أفضل! |
| `Time complexity` | $O(b^m)$ | b = عدد الحركات الممكنة، m = عمق الشجرة |
| `Space complexity` | $O(bm)$ | استكشاف عمق أولاً (`depth-first`) |

#### 📐 المعادلة: تعقيد Minimax الزمني

$$
T = O(b^m)
$$

**الشرح:**
> - $b$ = `branching factor` — عدد الحركات الممكنة في كل حالة
> - $m$ = `maximum depth` — أقصى عمق للشجرة
> - في الشطرنج: $b \approx 35$، $m \approx 100$ → عدد العقد = $35^{100}$ → **مستحيل حسابياً**

#### مهم للامتحان ⚠️:
> `Space complexity` لـ `Minimax` هو $O(bm)$ وليس $O(b^m)$ لأنه يستخدم `depth-first exploration` — يخزن مساراً واحداً فقط في كل وقت.

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** لماذا `Minimax` مثالي ضد خصم مثالي فقط وليس ضد خصم عشوائي؟
> **لماذا هذا مهم؟** لأنه يفترض أن الخصم يختار دائماً أسوأ حركة لك. إذا أخطأ الخصم، قد تكون هناك فرصة أفضل لم تأخذها.

---

### 6. More General Games (ألعاب أكثر عمومية)

#### النص الأصلي يقول:
> More than two players, non-zero-sum. Utilities are now tuples. Each player maximizes their own utility at each node. Utilities get propagated (backed up) from children to parents.

#### الشرح المبسّط:
في الألعاب التي تضم أكثر من لاعبين أو ليست `zero-sum`:
- كل لاعب يملك قيمته الخاصة في كل حالة → `utility tuple` (e.g. `4,3,2`)
- كل لاعب يختار الحركة التي **تزيد قيمته هو**
- القيم تنتقل صاعدة (`backed up`) من الأوراق للجذر

#### 💡 التشبيه:
> مثل ثلاثة أشخاص يتفاوضون على توزيع ميراث — كل واحد يحاول أخذ أكبر قدر ممكن لنفسه، ليس بالضرورة على حساب الآخرين فقط.
> **وجه الشبه:** `utility tuple` = حصة كل شخص، `backed up` = كل شخص يختار القسمة التي تفيده

#### ملاحظة:
> في `zero-sum games`: ما يكسبه MAX هو بالضبط ما يخسره MIN. أما في `non-zero-sum`: يمكن أن يكسب الطرفان أو يخسرا معاً.

---

### 7. Alpha-Beta Pruning (التقليم α-β)

#### النص الأصلي يقول:
> "Pruning does not affect final result. Good move ordering improves effectiveness of pruning. With 'perfect ordering,' time complexity = O(b^{m/2}) ⇒ doubles solvable depth. A simple example of metareasoning. Unfortunately, 35^{50} is still impossible!"

#### الشرح المبسّط:
`Alpha-Beta Pruning` هو تحسين على `Minimax` يقطع الفروع التي **لن تؤثر** على القرار النهائي، دون التأثير على النتيجة.

#### 💡 التشبيه:
> كأنك تبحث عن أفضل مطعم — بمجرد أن تجد مطعماً رائعاً، لا حاجة لفحص كل مطعم سيء واجهته سابقاً في نفس الشارع.
> **وجه الشبه:** المطعم الجيد = `alpha`، الشارع الجديد = الفرع الجديد للشجرة

#### لماذا يُسمّى α-β؟

- **α (alpha):** أفضل قيمة وجدها MAX حتى الآن على المسار الحالي — إذا وجد MIN قيمة أقل من α يقطعها (`α cutoff if α ≥ Z`)
- **β (beta):** أفضل قيمة وجدها MIN حتى الآن على المسار الحالي — إذا وجد MAX قيمة أعلى من β يقطعها (`β cutoff if β ≤ Z`)

#### 📐 المعادلة: تعقيد Alpha-Beta

$$
T_{best} = O(b^{m/2})
$$

**الشرح:**
> - مع ترتيب مثالي (`perfect ordering`) للحركات، يُقلَّص التعقيد لنصف الأس
> - يعني: يمكن حل ضعف عمق الشجرة بنفس الوقت
> - للشطرنج: $35^{50}$ بدلاً من $35^{100}$ — لا يزال كبيراً جداً!

#### 💻 الكود: `Alpha-Beta Algorithm`

#### ما هذا الكود؟
> نفس `Minimax` لكن مع تمرير قيمتي α و β لقطع الفروع غير المجدية.

```text
// ALPHA-BETA-DECISION: top-level call for MAX
function ALPHA-BETA-DECISION(state):
    return action a in ACTIONS(state)
           that maximizes MIN-VALUE(RESULT(a, state), -∞, +∞)

// MAX-VALUE with alpha-beta parameters
function MAX-VALUE(state, α, β):
    // α = best value MAX found so far on path
    // β = best value MIN found so far on path
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← -∞                           // initialize to worst for MAX
    for each (a, s) in SUCCESSORS(state):
        v ← MAX(v, MIN-VALUE(s, α, β))   // update best MAX can achieve
        if v ≥ β: return v            // β cutoff: MIN will avoid this branch
        α ← MAX(α, v)                 // update α (best MAX found so far)
    return v

// MIN-VALUE with alpha-beta parameters
function MIN-VALUE(state, α, β):
    // α = best value MAX found so far on path
    // β = best value MIN found so far on path
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← +∞                           // initialize to worst for MIN
    for each (a, s) in SUCCESSORS(state):
        v ← MIN(v, MAX-VALUE(s, α, β))   // update best MIN can achieve
        if v ≤ α: return v            // α cutoff: MAX will avoid this branch
        β ← MIN(β, v)                 // update β (best MIN found so far)
    return v
```

#### شرح كل سطر:
1. `ALPHA-BETA-DECISION` → يبدأ بـ α = -∞ و β = +∞ (لا قيود بعد)
2. `TERMINAL-TEST(state)` → حالة نهاية الشجرة — قيمة ثابتة
3. `v ← -∞` في MAX → أسوأ احتمال، سيُحدَّث فور إيجاد قيمة أفضل
4. `v ← MAX(v, MIN-VALUE(s, α, β))` → MAX يختار أكبر قيمة من الفروع
5. `if v ≥ β: return v` → **β cutoff**: MAX وجد قيمة لن يقبلها MIN → قطع
6. `α ← MAX(α, v)` → تحديث أفضل ما وصله MAX على هذا المسار
7. `v ← +∞` في MIN → أسوأ احتمال، سيُحدَّث فور إيجاد قيمة أقل
8. `if v ≤ α: return v` → **α cutoff**: MIN وجد قيمة لن يقبلها MAX → قطع
9. `β ← MIN(β, v)` → تحديث أفضل ما وصله MIN على هذا المسار

**الناتج المتوقع:**
> نفس القرار الصحيح مثل `Minimax` العادي، لكن بفروع أقل مُستكشَفة.

#### 🔍 تتبع التنفيذ: Alpha-Beta على مثال المحاضرة

**المدخل:** شجرة 2-ply بقيم أوراق: [3,12,8] [2,4,6] [14,5,2]

| الخطوة | العملية | α | β | القرار |
| --- | --- | --- | --- | --- |
| 1 | زيارة A₁₁=3 | 3 | +∞ | تحديث v=3 |
| 2 | زيارة A₁₂=12 | 3 | +∞ | v=3 (MIN لا يختار 12) |
| 3 | زيارة A₁₃=8 | 3 | +∞ | MIN(A₁)=3 → α=3 |
| 4 | زيارة A₂₁=2 | 3 | 3 | β=3، v=2 → α cutoff! لا حاجة لـ A₂₂, A₂₃ |
| 5 | زيارة A₃₁=14 | 3 | +∞ | β=14 |
| 6 | زيارة A₃₂=5 | 3 | 5 | β=5 |
| 7 | زيارة A₃₃=2 | 3 | 2 | β=2 ← 2<3 → لا فائدة لـ MAX |
| 8 | MAX النهائي | — | — | يختار A₁ بقيمة 3 |

**النتيجة:** `MAX` يختار `A₁` بقيمة **3** — نفس نتيجة `Minimax` لكن بتقليم فروع.

---

### 8. مثال تفصيلي: Alpha-Beta على شجرة كبيرة (صفحات 23–27)

#### النص الأصلي يقول:
> شجرة بأعماق متعددة، بعض الفروع تحتوي عقد ذات قيم عددية (5،10،3،16،7،5،8،9،8) وأخرى (2،4،6،6،4،2) — مع تمييز طبقات MAX (أزرق) وMIN (برتقالي)

#### الشرح المبسّط:
المحاضرة تُظهر مثالاً كاملاً بالألوان:
- **العقد الزرقاء** = MAX
- **العقد البرتقالية** = MIN / الأوراق
- القيم تُحسب من أسفل لأعلى (`backed up`)
- الفروع المقطوعة تُعلَّم بـ ⚡ (`cutoff`)

في الصفحتين 26-27: نرى الشجرة الكاملة أولاً ثم بعد تطبيق Alpha-Beta مع القيم المحسوبة (مثلاً: B=12، E=15، F=20، G=12، H=8، الجذر A=12).

#### مهم للامتحان ⚠️:
> القطع يحدث عندما:
> - عند عقدة MIN: وجدنا قيمة ≤ α → نقطع باقي الفروع (`α cutoff`)
> - عند عقدة MAX: وجدنا قيمة ≥ β → نقطع باقي الفروع (`β cutoff`)

---

### 9. Resource Limits and Approximate Evaluation (حدود الموارد والتقييم التقريبي)

#### النص الأصلي يقول:
> "Time limits ⇒ unlikely to find goal, must approximate" — استخدام `cutoff test` بدلاً من `terminal test` وإضافة `evaluation function`.

#### الشرح المبسّط:
لأن الشجرة الكاملة كبيرة جداً (خاصة الشطرنج)، نستخدم:
1. **`Cutoff test`** — نوقف البحث عند عمق معين بدلاً من الوصول للأوراق
2. **`Evaluation function`** — نقيّم الحالة الحالية بدالة تقريبية بدلاً من `Utility` الحقيقية

#### ⚖️ المقايضة: `Minimax` الكامل vs `Minimax` مع `cutoff`

| | `Minimax` الكامل | `Minimax` مع `cutoff` |
| --- | --- | --- |
| **المزايا** | مثالي تماماً | قابل للتطبيق في الوقت الحقيقي |
| **العيوب** | مستحيل للألعاب الكبيرة | قد لا يكون مثالياً |
| **متى تختاره** | ألعاب صغيرة (Tic-Tac-Toe) | الشطرنج، Go، كل الألعاب الكبيرة |

---

### 10. Games of Chance (ألعاب الحظ)

#### النص الأصلي يقول:
> ألعاب مثل `backgammon` و`monopoly` تضيف عنصر العشوائية عبر الزهر (`dice`)

#### الشرح المبسّط:
في ألعاب الحظ، نضيف **عقد الصدفة** (`chance nodes`) بين طبقات MAX وMIN. كل حركة تحتمل نتائج عدة بأوزان احتمالية — نستخدم القيمة المتوقعة (`expected value`).

#### 💡 التشبيه:
> مثل لاعب `backgammon` الذي يخطط لحركته لكن الزهر يحدد ما يتاح فعله.
> **وجه الشبه:** `chance node` = رمية الزهر، `expected value` = متوسط ما تتوقع كسبه

---

### 11. Games of Imperfect Information (ألعاب المعلومات الناقصة)

#### النص الأصلي يقول:
> أمثلة: `bridge`, `poker`, `scrabble`, `nuclear war` — `imperfect information` + `chance`

#### الشرح المبسّط:
عندما لا يرى اللاعب حالة اللعبة الكاملة (كالأوراق المخفية في البوكر)، الخوارزميات الكلاسيكية تحتاج تعديلاً. نستخدم **المعتقدات** (`beliefs`) حول الحالة المحتملة بدلاً من اليقين الكامل.

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** لماذا `nuclear war` يُصنَّف في خانة `imperfect information + chance`؟
> **لماذا هذا مهم؟** لأن كل طرف لا يعرف نوايا الآخر الكاملة (معلومات ناقصة) والنتائج تعتمد على عوامل عشوائية.

---

## الجزء الثاني: ملخص منظم

---

### أهم التعاريف والمفاهيم

| المصطلح | التعريف | مثال/ملاحظة |
| --- | --- | --- |
| `Strategy` | خطة تحدد حركة لكل وضع ممكن | لا تُشترط خطة واحدة بل شجرة من الردود |
| `Game Tree` | شجرة تمثل جميع حالات اللعبة | طبقات MAX وMIN تتناوب |
| `Minimax Value` | أفضل `utility` يضمنه اللاعب ضد خصم مثالي | يُحسب بـ `MAX-VALUE` / `MIN-VALUE` |
| `Utility` | قيمة نهاية اللعبة للاعب | +1 فوز، 0 تعادل، -1 خسارة |
| `Terminal State` | حالة نهاية اللعبة | لا توجد حركات ممكنة |
| `α (alpha)` | أفضل قيمة وجدها MAX حتى الآن | يُقطع إذا MIN وجد ما هو أقل |
| `β (beta)` | أفضل قيمة وجدها MIN حتى الآن | يُقطع إذا MAX وجد ما هو أكبر |
| `Pruning` | حذف فروع لا تؤثر على القرار | لا يغير النتيجة النهائية |
| `Branching factor (b)` | عدد الحركات الممكنة لكل حالة | الشطرنج: b≈35 |
| `Depth (m)` | عمق الشجرة | الشطرنج: m≈100 |
| `Ply` | نصف دور (حركة لاعب واحد) | 2-ply = دور كامل |
| `Non-zero-sum` | مجموع المكاسب ليس صفراً | يمكن لكل الأطراف الكسب |
| `Utility Tuple` | قيمة مصفوفة لكل لاعب | (4,3,2) = قيم اللاعبين 1,2,3 |
| `Cutoff Test` | توقف البحث قبل الأوراق | يُستخدم مع `evaluation function` |
| `Evaluation Function` | دالة تقريبية لقيمة الحالة | تعوّض عن `Utility` الحقيقية |

---

### جداول مقارنات سريعة

| المعيار | `Minimax` | `Alpha-Beta Pruning` |
| --- | --- | --- |
| النتيجة | مثالية | مثالية (نفس الإجابة) |
| تعقيد زمني | $O(b^m)$ | $O(b^{m/2})$ في أفضل الحالات |
| تعقيد مكاني | $O(bm)$ | $O(bm)$ |
| هل يقطع فروع؟ | لا | نعم |
| متطلبات | لا شيء | ترتيب جيد للحركات يحسّن الأداء |
| الاكتمال | نعم (شجرة محدودة) | نعم |
| المثالية | نعم ضد خصم مثالي | نعم |

---

### قاموس المصطلحات

| الفئة | المصطلحات |
| --- | --- |
| أنواع الألعاب | `deterministic`، `chance`، `perfect information`، `imperfect information`، `zero-sum`، `non-zero-sum` |
| هيكل الشجرة | `game tree`، `terminal node`، `ply`، `branching factor`، `depth`، `utility` |
| Minimax | `strategy`، `MAX-VALUE`، `MIN-VALUE`، `minimax value`، `backed up` |
| Alpha-Beta | `alpha`، `beta`، `α cutoff`، `β cutoff`، `pruning`، `perfect ordering` |
| التقريب | `cutoff test`، `evaluation function`، `horizon effect` |
| ألعاب خاصة | `backgammon`، `chance node`، `expected value`، `belief state` |

---

### أبرز النقاط الذهبية

1. `Minimax` يضمن اللعب الأمثل فقط **ضد خصم مثالي**.
2. `Alpha-Beta Pruning` لا يغير النتيجة — فقط يسرّع الحساب.
3. مع ترتيب مثالي: `Alpha-Beta` يُضاعف عمق البحث المحتمل.
4. للشطرنج: حتى مع Alpha-Beta، $35^{50}$ مستحيل — لذا نلجأ للـ `cutoff` + `evaluation`.
5. `Space complexity` لـ `Minimax` = $O(bm)$ لأنه `depth-first`.
6. في الألعاب متعددة اللاعبين: كل لاعب يعظّم قيمته في `utility tuple`.
7. `α cutoff` يقطع عقدة MIN إذا وجد قيمة ≤ α (MAX لن يختار هذا الفرع أبداً).
8. `β cutoff` يقطع عقدة MAX إذا وجد قيمة ≥ β (MIN لن يختار هذا الفرع أبداً).

---

### الأخطاء الشائعة عند الطلاب ⚠️

| الخطأ | التصحيح |
| --- | --- |
| "Alpha-Beta يعطي نتيجة مختلفة عن Minimax" | ❌ كلاهما يعطيان **نفس** القرار النهائي |
| "α هو أفضل قيمة لـ MIN" | ❌ α هو أفضل قيمة لـ MAX — β هو لـ MIN |
| "`Minimax` مثالي ضد أي خصم" | ❌ مثالي ضد **خصم مثالي** فقط |
| "α cutoff عند MAX" | ❌ α cutoff يحدث عند عقدة **MIN** عندما وجدت قيمة ≤ α |
| "تعقيد Alpha-Beta = O(b^{m/2}) دائماً" | ❌ هذا في **أفضل الأحوال** مع ترتيب مثالي |
| "Utility tuple تعني zero-sum" | ❌ الـ tuple يُستخدم في non-zero-sum بالعكس |

---

### خطوات وإجراءات المحاضرة

#### ⚙️ الخطوات / الخوارزمية: `Minimax`

> **ما هدفها؟** إيجاد أفضل حركة لـ MAX مع افتراض لعب مثالي من الخصم MIN.

```algorithm
1 | استدعاء MINIMAX-DECISION(state) | ACTIONS(state) | تحديد الحركات الممكنة
2 | لكل حركة a | RESULT(a, state) | حساب الحالة الناتجة
3 | استدعاء MIN-VALUE(s) | recursive call | تقييم رد MIN الأفضل
4 | اختيار a الذي يعطي أعلى MIN-VALUE | MAX | القرار النهائي
5 | في MAX-VALUE: إذا terminal → return UTILITY | TERMINAL-TEST | حالة أساسية
6 | في MAX-VALUE: for each successor → v=MAX(v, MIN-VALUE(s)) | SUCCESSORS | تحديث v
7 | في MIN-VALUE: إذا terminal → return UTILITY | TERMINAL-TEST | حالة أساسية
8 | في MIN-VALUE: for each successor → v=MIN(v, MAX-VALUE(s)) | SUCCESSORS | تحديث v
```

#### نقاط التنفيذ:
- الاستدعاء المتبادل بين MAX-VALUE وMIN-VALUE هو جوهر الخوارزمية
- الأساس: `TERMINAL-TEST` يوقف التعمّق
- الخطأ الشائع: نسيان تهيئة v بـ -∞ في MAX أو +∞ في MIN

---

#### ⚙️ الخطوات / الخوارزمية: `Alpha-Beta Pruning`

> **ما هدفها؟** تسريع `Minimax` عبر قطع الفروع التي لن تؤثر على القرار.

```algorithm
1  | ابدأ بـ ALPHA-BETA-DECISION(state) | α=-∞، β=+∞ | لا قيود في البداية
2  | في MAX-VALUE: تهيئة v=-∞ | — | أسوأ حالة لـ MAX
3  | لكل خلف s في SUCCESSORS | SUCCESSORS | استكشاف الفروع
4  | v ← MAX(v, MIN-VALUE(s, α, β)) | MIN-VALUE | تحديث أفضل قيمة MAX
5  | إذا v ≥ β: اقطع (β cutoff) | pruning | MIN لن يختار هذا الفرع
6  | تحديث α ← MAX(α, v) | — | تحسين الحد الأدنى لـ MAX
7  | في MIN-VALUE: تهيئة v=+∞ | — | أسوأ حالة لـ MIN
8  | v ← MIN(v, MAX-VALUE(s, α, β)) | MAX-VALUE | تحديث أفضل قيمة MIN
9  | إذا v ≤ α: اقطع (α cutoff) | pruning | MAX لن يختار هذا الفرع
10 | تحديث β ← MIN(β, v) | — | تحسين الحد الأعلى لـ MIN
```

#### نقاط التنفيذ:
- α وβ يُمرَّران بالمرجع (يُحدَّثان أثناء التنفيذ)
- القطع لا يعني خطأ — يعني عدم الحاجة للفرع
- كلما كان ترتيب الحركات أفضل (الأقوى أولاً)، زاد القطع

---

### أنماط الأكواد والبنى المتكررة

| النمط | البنية الأساسية | متى تستخدمه |
| --- | --- | --- |
| استدعاء متبادل (mutual recursion) | MAX-VALUE ↔ MIN-VALUE | جوهر Minimax |
| حالة أساسية قبل التكرار | `if TERMINAL-TEST: return UTILITY` | منع التعمق إلى ما لا نهاية |
| تهيئة بالقيمة الأسوأ | `v ← -∞` في MAX، `v ← +∞` في MIN | ضمان التحديث الصحيح |
| شرط القطع | `if v ≥ β: return` في MAX | Alpha-Beta فقط |

---

### الأفكار الرئيسية الشاملة

`Minimax` + `Alpha-Beta` هما أساس كل برامج الألعاب الحاسوبية الكلاسيكية. الفكرة المركزية: **التوازن بين الدقة والسرعة** — اللعب المثالي مستحيل حسابياً لمعظم الألعاب، لذا نستخدم تقريبات ذكية مثل القطع والتقييم.

---

## الجزء الثالث: أسئلة اختيار من متعدد (MCQ)

> **18 سؤالاً** — مستوى: medium/hard. التوزيع: مقارنات 25% | pseudocode/تتبع 35% | تطبيق 25% | تتبع خوارزمية 15%.

---

### السؤال 1 (medium) — مقارنة
ما الفرق الجوهري بين `Minimax` و`Alpha-Beta Pruning`؟

أ) `Alpha-Beta` يعطي نتيجة أفضل من `Minimax`
ب) `Alpha-Beta` يعطي نفس النتيجة بوقت أقل
ج) `Minimax` أسرع لكن `Alpha-Beta` أكثر دقة
د) `Alpha-Beta` يستخدم `BFS` بينما `Minimax` يستخدم `DFS`

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ صحيح: `Alpha-Beta` يقطع فروعاً لن تؤثر على القرار → نفس الإجابة بزمن أقل
- أ ❌ خطأ: كلاهما يعطيان **نفس** القرار النهائي
- ج ❌ خطأ: `Minimax` أبطأ لأنه يستكشف جميع الفروع
- د ❌ خطأ: كلاهما يستخدمان `depth-first` (الاستدعاء المتكرر)

---

### السؤال 2 (hard) — pseudocode/تتبع
في `Alpha-Beta`، تُعلن `β cutoff` في حالة `MAX-VALUE` عندما:

أ) `v ≤ α`
ب) `v ≥ β`
ج) `α ≥ β`
د) `v ≤ β`

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ صحيح: في `MAX-VALUE`، إذا وجد MAX قيمة `v ≥ β` → MIN لن يختار هذا الفرع أبداً → نقطع
- أ ❌ هذا شرط `α cutoff` ويحدث في `MIN-VALUE`
- ج ❌ هذا شرط عام للقطع الكلي لكن ليس الصيغة المباشرة
- د ❌ العلاقة المعكوسة — في MIN-VALUE نقطع عند `v ≤ α`

---

### السؤال 3 (medium) — تصنيف الألعاب
أي من الألعاب التالية يقع في خانة `deterministic` + `imperfect information`؟

أ) شطرنج
ب) `backgammon`
ج) `battleships`
د) بوكر

**الإجابة الصحيحة: ج**
**التعليل:**
- ج ✅ `Battleships`: حركات محددة (لا زهر) لكن كل لاعب لا يرى سفن الآخر
- أ ❌ شطرنج: `deterministic` + `perfect information`
- ب ❌ `backgammon`: `perfect information` + `chance`
- د ❌ بوكر: `imperfect information` + `chance`

---

### السؤال 4 (hard) — تتبع
في شجرة `Minimax` 2-ply بقيم أوراق: A₁ = [3,12,8]، A₂ = [2,4,6]، A₃ = [14,5,2]. ما الحركة التي يختارها MAX؟

أ) A₁
ب) A₂
ج) A₃
د) لا يمكن تحديده

**الإجابة الصحيحة: أ**
**التعليل:**
- أ ✅ MIN(A₁)=3، MIN(A₂)=2، MIN(A₃)=2 → MAX(3,2,2)=3 → يختار A₁
- ب ❌ MIN(A₂)=2 < MIN(A₁)=3
- ج ❌ MIN(A₃)=2 < MIN(A₁)=3
- د ❌ الحساب ممكن تماماً بالمعطيات

---

### السؤال 5 (medium) — مقارنة تعقيد
ما تعقيد `Alpha-Beta` الزمني في **أفضل الأحوال** (ترتيب مثالي)؟

أ) $O(b^m)$
ب) $O(b \cdot m)$
ج) $O(b^{m/2})$
د) $O(m^2)$

**الإجابة الصحيحة: ج**
**التعليل:**
- ج ✅ مع ترتيب مثالي: كل ثانية فرع تقريباً يُقطع → $O(b^{m/2})$
- أ ❌ هذا تعقيد `Minimax` العادي
- ب ❌ هذا تعقيد `DFS` البسيط
- د ❌ لا صلة له بالـ `branching factor`

---

### السؤال 6 (hard) — سيناريو pseudocode
في الكود التالي، ما المشكلة؟
```text
function MAX-VALUE(state, α, β):
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← +∞
    for (a,s) in SUCCESSORS(state):
        v ← MAX(v, MIN-VALUE(s, α, β))
        if v ≥ β: return v
        α ← MAX(α, v)
    return v
```

أ) لا يوجد خطأ
ب) تهيئة v يجب أن تكون -∞ وليس +∞
ج) شرط القطع خاطئ
د) يجب استخدام MIN-VALUE بدلاً من MAX-VALUE

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ في `MAX-VALUE`، v يجب أن يبدأ بـ -∞ حتى تكون أي قيمة أفضل منها → تضمن التحديث الصحيح
- أ ❌ يوجد خطأ واضح في التهيئة
- ج ❌ شرط `v ≥ β` صحيح لـ MAX-VALUE
- د ❌ هذه دالة MAX-VALUE وليس MIN-VALUE

---

### السؤال 7 (medium) — تطبيق
لماذا يقول الكتاب أن `Minimax` هو لعب مثالي ضد خصم **مثالي** فقط؟

أ) لأنه يقلل أخطاء الكود
ب) لأنه يفترض أن الخصم سيختار دائماً الحركة الأسوأ لك
ج) لأنه لا يعمل مع ألعاب الحظ
د) لأن `alpha-beta` لا يعطي نتائج صحيحة مع خصم عشوائي

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ `Minimax` يفترض أن MIN يلعب بشكل مثالي (يختار دائماً أسوأ قيمة لـ MAX). ضد خصم أضعف، قد توجد استراتيجية أكثر استغلالاً
- أ ❌ لا علاقة بأخطاء الكود
- ج ❌ هذا قيد مختلف (ألعاب الحظ تحتاج `expectiminimax`)
- د ❌ السؤال عن `Minimax` وليس `Alpha-Beta`

---

### السؤال 8 (hard) — تتبع خوارزمية
شجرة Minimax: الجذر MAX، يتفرع لعقدتين MIN. MIN الأولى يتفرع لقيم [2, 9]. MIN الثانية يتفرع لقيم [3, 1]. ما قيمة الجذر؟

أ) 9
ب) 3
ج) 2
د) 1

**الإجابة الصحيحة: ج**
**التعليل:**
- ج ✅ MIN الأولى = min(2,9) = 2 | MIN الثانية = min(3,1) = 1 | MAX(2,1) = 2
- أ ❌ 9 هو أعلى ورقة في MIN الأولى، لكن MIN لن يختاره
- ب ❌ 3 هو ورقة في MIN الثانية، لكن min(3,1)=1
- د ❌ 1 هو قيمة MIN الثانية، لكن MAX(2,1)=2 وليس 1

---

### السؤال 9 (medium) — مقارنة
ما `Space complexity` لخوارزمية `Minimax`؟

أ) $O(b^m)$
ب) $O(bm)$
ج) $O(m)$
د) $O(b)$

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ لأن `Minimax` يستخدم `depth-first exploration` — يحتفظ بمسار من الجذر لأعمق عقدة بعمق m مع b فرع لكل مستوى
- أ ❌ هذا هو عدد العقد الكلي (تعقيد زمني لا مكاني)
- ج ❌ O(m) يصح لـ DFS البسيط دون تخزين الفروع
- د ❌ لا يكفي لحفظ المسار الكامل

---

### السؤال 10 (hard) — سيناريو
في شجرة Alpha-Beta: MAX عند الجذر، α=-∞، β=+∞. بعد استكشاف الفرع الأول، أصبح α=5. الآن في MIN الثانية وجد قيمة v=3. ماذا يحدث؟

أ) يحدّث β=3 ويكمل
ب) يقطع فوراً (α cutoff) لأن v=3 ≤ α=5
ج) يحدّث α=3 ويكمل
د) يعود للجذر مباشرة

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ نحن في `MIN-VALUE`، الشرط: `if v ≤ α: return v` → v=3 ≤ α=5 → قطع! MAX لن يختار هذا الفرع لأن الأفضل له = 5
- أ ❌ β يُحدَّث فقط إذا v < β ولم نقطع بعد
- ج ❌ α يُحدَّث فقط في `MAX-VALUE`
- د ❌ لا نعود للجذر، نعود للمستدعي فقط

---

### السؤال 11 (medium) — تطبيق
ما المقصود بـ `Utility Tuple` في الألعاب متعددة اللاعبين؟

أ) عدد الحركات الممكنة لكل لاعب
ب) مجموعة قيم تمثل مكسب كل لاعب عند نهاية اللعبة
ج) عمق الشجرة لكل لاعب
د) الفرق بين قيمة α و β

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ `(4,3,2)` تعني: اللاعب1 يكسب 4، اللاعب2 يكسب 3، اللاعب3 يكسب 2
- أ ❌ عدد الحركات = `branching factor`
- ج ❌ عمق الشجرة = `depth m`
- د ❌ الفرق بين α و β لا اسم له في المحاضرة

---

### السؤال 12 (hard) — pseudocode
في Alpha-Beta، ما الفرق بين شرطي `α cutoff` و`β cutoff`؟

أ) α cutoff في MAX-VALUE، β cutoff في MIN-VALUE
ب) α cutoff في MIN-VALUE (`v ≤ α`)، β cutoff في MAX-VALUE (`v ≥ β`)
ج) كلاهما في MAX-VALUE
د) كلاهما في MIN-VALUE

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ في MIN-VALUE: إذا `v ≤ α` → MAX لن يأتي لهنا (α cutoff). في MAX-VALUE: إذا `v ≥ β` → MIN لن يأتي لهنا (β cutoff)
- أ ❌ العكس تماماً
- ج, د ❌ كل قطع في دالة مختلفة

---

### السؤال 13 (medium) — مقارنة
ما الفرق بين `zero-sum` و`non-zero-sum` games؟

أ) في `zero-sum`: ما يكسبه أحد = ما يخسره الآخر. في `non-zero-sum`: يمكن للطرفين الكسب
ب) في `zero-sum`: لا يوجد رابح. في `non-zero-sum`: يوجد رابح دائماً
ج) `zero-sum` للعبتين فقط. `non-zero-sum` لثلاثة لاعبين فأكثر
د) `zero-sum` أسهل حسابياً دائماً

**الإجابة الصحيحة: أ**
**التعليل:**
- أ ✅ التعريف الدقيق: في `zero-sum` مجموع `utilities` = ثابت. في `non-zero-sum` يمكن تعاون مربح للجميع
- ب ❌ في `zero-sum` يوجد رابح وخاسر (الشطرنج)
- ج ❌ `zero-sum` ممكن مع أكثر من لاعبين
- د ❌ ليس بالضرورة

---

### السؤال 14 (hard) — تتبع خوارزمية
لماذا يُعدّ `Alpha-Beta` نوعاً من `metareasoning`؟

أ) لأنه يستخدم ذكاء اصطناعي
ب) لأنه يستدل على أي عمليات حسابية تستحق إجراؤها وأيها لا
ج) لأنه يتعلم من الأخطاء
د) لأنه يحسب احتمالات

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ `Metareasoning` = التفكير في عملية التفكير نفسها. Alpha-Beta يستنتج أن فروعاً بعينها **لن تؤثر** على القرار → لا داعي لحسابها
- أ ❌ كل خوارزمية AI تستخدم ذكاء اصطناعي
- ج ❌ لا تعلم في Alpha-Beta الكلاسيكي
- د ❌ Alpha-Beta لا يستخدم احتمالات

---

### السؤال 15 (medium) — تطبيق
في الشطرنج، لماذا لا يمكن تطبيق `Minimax` الكامل؟

أ) لأن الشطرنج ليس `deterministic`
ب) لأن $b \approx 35$ و $m \approx 100$ → $35^{100}$ عملية غير ممكنة
ج) لأن `Alpha-Beta` يعطي إجابة أفضل
د) لأن قواعد الشطرنج لا تنتهي

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ $35^{100}$ عدد هائل يستحيل حسابه حتى مع أسرع حاسوب
- أ ❌ الشطرنج `deterministic` تماماً
- ج ❌ Alpha-Beta يعطي نفس الإجابة لكن بسرعة — لا يعطي إجابة أفضل
- د ❌ الشطرنج له قواعد نهاية محددة

---

### السؤال 16 (hard) — سيناريو pseudocode
```text
function MIN-VALUE(state, α, β):
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← +∞
    for (a,s) in SUCCESSORS(state):
        v ← MIN(v, MAX-VALUE(s, α, β))
        if v ≤ β: return v      // ← هل هذا صحيح؟
        β ← MIN(β, v)
    return v
```
ما الخطأ في الكود؟

أ) تهيئة v يجب أن تكون -∞
ب) شرط القطع يجب أن يكون `v ≤ α` وليس `v ≤ β`
ج) يجب حذف سطر `β ← MIN(β, v)`
د) `MIN-VALUE` يجب أن تستدعي `MIN-VALUE` وليس `MAX-VALUE`

**الإجابة الصحيحة: ب**
**التعليل:**
- ب ✅ في `MIN-VALUE`، القطع يحدث إذا `v ≤ α` (MAX لن يأتي لهنا). الشرط المكتوب `v ≤ β` خاطئ لأن β هو حدود MIN نفسه
- أ ❌ `+∞` صحيح للـ MIN-VALUE
- ج ❌ سطر تحديث β ضروري
- د ❌ MIN-VALUE تستدعي MAX-VALUE صحيح (التكرار المتبادل)

---

### السؤال 17 (medium) — مقارنة
ما الفرق بين `ply` و`depth` في شجرة اللعبة؟

أ) `ply` = حركة لاعب واحد، `depth` = عدد الـ plies
ب) `ply` = عمق الشجرة الكاملة، `depth` = حركة واحدة
ج) هما نفس الشيء
د) `ply` خاص بـ Minimax، `depth` خاص بـ Alpha-Beta

**الإجابة الصحيحة: أ**
**التعليل:**
- أ ✅ `1-ply` = حركة MAX فقط. `2-ply` = حركة MAX + رد MIN (دور كامل). `depth` يصف عمق البحث عادةً بعدد الـ plies
- ب ❌ عكس التعريف
- ج ❌ مختلفان
- د ❌ المصطلحان مستقلان عن الخوارزمية

---

### السؤال 18 (hard) — تتبع + سيناريو مركّب

**السيناريو:** شجرة Alpha-Beta بعمق 2 (MAX → MIN → أوراق). الفروع:
- الفرع الأول لـ MIN₁: أوراق [5, 1]
- الفرع الثاني لـ MIN₂: أوراق [7, 4]

بعد حساب MIN₁ = 1، هل يقطع Alpha-Beta فرعاً في MIN₂؟

أ) نعم — بعد رؤية 7 في MIN₂، يحدث β cutoff
ب) نعم — بعد رؤية 7 في MIN₂، يحدث α cutoff في MIN₂
ج) لا — يحسب كل الأوراق
د) يعتمد على قيمة β الابتدائية

**الإجابة الصحيحة: ج**
**التعليل:**
- ج ✅ α = MAX يعرف أفضله = 1 (من MIN₁). في MIN₂: أولاً يرى 7 → v=7، لكن 7 > α=1 → لا قطع. ثم يرى 4 → v=4، 4 > α=1 → لا قطع. MIN₂=4. MAX(1,4)=4 يختار MIN₂.
- أ ❌ β cutoff يحدث في MAX-VALUE، ليس هنا
- ب ❌ α cutoff يحدث في MIN-VALUE عند `v ≤ α`، لكن min(7,4)=4 > α=1
- د ❌ β الابتدائي = +∞ لا يؤثر هنا

---

## الجزء الرابع: أسئلة تصحيح الخوارزميات (Pseudocode)

> غطّي أنواع الأخطاء: منطقية، سوء فهم، heuristic خاطئ، حلقة لا نهائية.

---

### سؤال تصحيح 1 — خطأ منطقي (logic)

**الكود التالي يحتوي خطأ:**
```text
function MAX-VALUE(state):
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← +∞
    for (a, s) in SUCCESSORS(state):
        v ← MAX(v, MIN-VALUE(s))
    return v
```

**اكتشف الخطأ:** تهيئة `v ← +∞` خاطئة في `MAX-VALUE`

**التصحيح:**
```text
function MAX-VALUE(state):
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← -∞                          // FIXED: initialize to worst for MAX
    for (a, s) in SUCCESSORS(state):
        v ← MAX(v, MIN-VALUE(s))
    return v
```

**شرح الحل:**
1. `MAX-VALUE` تبحث عن أكبر قيمة، لذا يجب أن يبدأ `v` بـ `-∞` حتى تكون أي قيمة أفضل منها
2. إذا بدأنا بـ `+∞` ستُحسب نتيجة `MAX(+∞, أي_شيء) = +∞` دائماً → لا يحدث تحديث حقيقي
3. في `MIN-VALUE` العكس صحيح: ابدأ بـ `+∞`

---

### سؤال تصحيح 2 — سوء فهم (misconception)

**الكود التالي يحتوي خطأ:**
```text
function MIN-VALUE(state, α, β):
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← +∞
    for (a, s) in SUCCESSORS(state):
        v ← MIN(v, MAX-VALUE(s, α, β))
        if v ≥ β: return v           // ERROR here
        β ← MIN(β, v)
    return v
```

**اكتشف الخطأ:** شرط القطع يجب أن يكون `v ≤ α` وليس `v ≥ β`

**التصحيح:**
```text
function MIN-VALUE(state, α, β):
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← +∞
    for (a, s) in SUCCESSORS(state):
        v ← MIN(v, MAX-VALUE(s, α, β))
        if v ≤ α: return v           // FIXED: α cutoff for MIN-VALUE
        β ← MIN(β, v)
    return v
```

**شرح الحل:**
1. في `MIN-VALUE`: إذا وجدنا قيمة `v ≤ α`، فإن MAX لن يختار هذا الفرع (لأنه يعرف بديلاً أفضل = α) → نقطع
2. الشرط `v ≥ β` هو β cutoff ويخص `MAX-VALUE` وليس `MIN-VALUE`
3. الخلط بين شروط القطع من أكثر الأخطاء شيوعاً

---

### سؤال تصحيح 3 — حلقة لا نهائية (infinite_loop)

**الكود التالي يحتوي خطأ:**
```text
function MINIMAX-DECISION(state):
    return action a in ACTIONS(state)
           that maximizes MAX-VALUE(RESULT(a, state))
```

**اكتشف الخطأ:** `MINIMAX-DECISION` تستدعي `MAX-VALUE` بدلاً من `MIN-VALUE`

**التصحيح:**
```text
function MINIMAX-DECISION(state):
    return action a in ACTIONS(state)
           that maximizes MIN-VALUE(RESULT(a, state))  // FIXED: call MIN-VALUE
```

**شرح الحل:**
1. `MINIMAX-DECISION` تُحسب من منظور MAX — تبحث عن الحركة التي تُعظّم ما **يحصل عليه بعد رد MIN**
2. استدعاء `MAX-VALUE` مباشرةً يعني تجاهل دور MIN تماماً → يختار MAX أعلى قيمة بغض النظر عن الخصم
3. المنطق الصحيح: MAX يختار الحركة التي تُعظّم `MIN-VALUE` (أفضل ما يمكن لـ MAX بعد رد MIN المثالي)

---

### سؤال تصحيح 4 — خطأ منطقي في القطع (logic)

**الكود التالي يحتوي خطأ:**
```text
function MAX-VALUE(state, α, β):
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← -∞
    for (a, s) in SUCCESSORS(state):
        v ← MAX(v, MIN-VALUE(s, α, β))
        if v ≥ β: return v
        β ← MAX(β, v)              // ERROR: should update α not β
    return v
```

**اكتشف الخطأ:** يجب تحديث `α` وليس `β` في `MAX-VALUE`

**التصحيح:**
```text
function MAX-VALUE(state, α, β):
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← -∞
    for (a, s) in SUCCESSORS(state):
        v ← MAX(v, MIN-VALUE(s, α, β))
        if v ≥ β: return v
        α ← MAX(α, v)              // FIXED: update α in MAX-VALUE
    return v
```

**شرح الحل:**
1. `α` = أفضل ما وجده MAX حتى الآن → يُحدَّث في `MAX-VALUE` بالقيمة الكبرى
2. `β` = أفضل ما وجده MIN حتى الآن → يُحدَّث في `MIN-VALUE` بالقيمة الصغرى
3. تحديث `β` في `MAX-VALUE` يفسد منطق القطع كاملاً

---

### سؤال تصحيح 5 — sوء فهم Minimax متعدد اللاعبين (misconception)

**الكود التالي يحتوي خطأ:**
```text
// 3-player game: players A, B, C
function choose-action(state, player):
    if TERMINAL-TEST(state): return UTILITY(state)
    best ← -∞
    for s in SUCCESSORS(state):
        val ← choose-action(s, next_player(player))
        best ← MAX(best, val)   // ERROR: MAX used for all players
    return best
```

**اكتشف الخطأ:** جميع اللاعبين يستخدمون `MAX` — يجب أن يعظّم كل لاعب قيمته الخاصة في `utility tuple`

**التصحيح:**
```text
function choose-action(state, player):
    if TERMINAL-TEST(state): return UTILITY(state)   // returns tuple
    best ← -∞
    best_tuple ← null
    for s in SUCCESSORS(state):
        val_tuple ← choose-action(s, next_player(player))
        if val_tuple[player] > best:                 // FIXED: compare own utility
            best ← val_tuple[player]
            best_tuple ← val_tuple
    return best_tuple
```

**شرح الحل:**
1. في الألعاب متعددة اللاعبين، `Utility` هو `tuple` وليس قيمة واحدة
2. كل لاعب يعظّم قيمته الخاصة فقط (`val_tuple[player]`)
3. يُرجع الـ `tuple` كاملاً لأن الـ `backup` يحتاجه

---

### سؤال تصحيح 6 — wrong_heuristic (تقييم خاطئ)

**الكود التالي يحتوي خطأ:**
```text
// Minimax with cutoff — evaluation function for chess
function EVAL(state):
    // counts total pieces only
    return count_all_pieces(state)   // ERROR: doesn't favor any player
```

**اكتشف الخطأ:** دالة التقييم تحسب مجموع القطع لكلا الطرفين — لا تفرّق بين قطع MAX وقطع MIN

**التصحيح:**
```text
function EVAL(state):
    // returns advantage for MAX over MIN
    return count_pieces(MAX, state) - count_pieces(MIN, state)
    // FIXED: positive = advantage for MAX, negative = advantage for MIN
```

**شرح الحل:**
1. `Evaluation function` يجب أن تُعبّر عن **الميزة النسبية** لـ MAX
2. إذا كانت القيمة موجبة → MAX في موضع أفضل
3. إذا كانت سالبة → MIN في موضع أفضل
4. مجرد عدّ قطع الجميع معاً لا يعطي معلومة مفيدة عن من يتقدم

---

## الجزء الرابع: تمارين تطبيقية (من إعداد الدليل للتدريب)

> **هذه تمارين إضافية من إعداد الدليل للتدريب**

---

### تمرين 1: تتبع Minimax بسيط — search_trace

**السيناريو / المطلوب:**
شجرة Minimax من 3 مستويات (MAX → MIN → أوراق):
- العقدة الجذر MAX تتفرع لـ: B وC
- B (MIN) تتفرع لـ: [8, 2, 5]
- C (MIN) تتفرع لـ: [6, 1, 7]

**المطلوب:**
1. احسب قيمة B وقيمة C
2. ما الحركة التي يختارها MAX؟
3. ما قيمة الجذر؟

**نموذج الحل:**
1. B = min(8,2,5) = **2** | C = min(6,1,7) = **1**
2. MAX يختار الفرع الأعلى: max(2,1) = 2 → يختار **B**
3. قيمة الجذر = **2**

---

### تمرين 2: تصنيف لعبة — scenario

**السيناريو:**
صنّف كل من الألعاب التالية حسب (deterministic/chance) و(perfect/imperfect information):
1. ألعاب الورق المكشوفة (Solitaire)
2. لعبة `Go`
3. `Scrabble`
4. `Battleships`

**نموذج الحل:**

| اللعبة | نوع الحركة | نوع المعلومات |
| --- | --- | --- |
| Solitaire | `chance` (توزيع أوراق عشوائي) | `perfect information` (تعرف جميع أوراقك) |
| Go | `deterministic` | `perfect information` |
| Scrabble | `chance` (أحرف عشوائية) | `imperfect information` (لا ترى أحرف خصمك) |
| Battleships | `deterministic` | `imperfect information` (لا ترى سفن خصمك) |

---

### تمرين 3: تطبيق Alpha-Beta — minimax_trace

**السيناريو:**
شجرة 2-ply (MAX → MIN → أوراق):
- MIN₁: أوراق [3, 17, 2]
- MIN₂: أوراق [15, 5, 12]
- MIN₃: أوراق [2, 8, 4]

**المطلوب:**
1. حدد قيم MIN₁، MIN₂، MIN₃
2. ما الحركة التي يختارها MAX؟
3. أي الأوراق يمكن قطعها بـ Alpha-Beta؟

**نموذج الحل:**
1. MIN₁ = min(3,17,2) = **2** | MIN₂ = min(15,5,12) = **5** | MIN₃ = min(2,8,4) = **2**
2. MAX يختار: max(2,5,2) = 5 → يختار **MIN₂**
3. بعد حساب MIN₁ = 2، α = 2. في MIN₂ نرى 15 ثم 5 → v=5 > α=2 → لا قطع. في MIN₃ نرى 2 → v=2 ≤ α=2 (أو v=2 = α → **α cutoff** حسب التعريف الصارم `v ≤ α`) → تُقطع الأوراق 8 و4 في MIN₃.

---

### تمرين 4: اكتشف الخطأ في الاستنتاج — code_fix

**المطلوب:** هل العبارة التالية صحيحة؟
> "إذا استخدمت Alpha-Beta مع ترتيب عشوائي للحركات، قد أحصل على نتيجة مختلفة عن Minimax"

**نموذج الحل:**
**خاطئة ✅**
`Alpha-Beta Pruning` يعطي **دائماً** نفس نتيجة `Minimax`، بغض النظر عن ترتيب الحركات. الترتيب يؤثر فقط على **عدد الفروع المقطوعة** (الكفاءة)، وليس على **صحة القرار النهائي**.

---

### تمرين 5: fill_gaps — أكمل الجدول

**المطلوب:** أكمل الجدول التالي:

| | `Minimax` | `Alpha-Beta` |
| --- | --- | --- |
| تعقيد زمني | _______ | _______ (أفضل حالة) |
| تعقيد مكاني | _______ | _______ |
| يقطع فروع؟ | _______ | _______ |
| يغيّر النتيجة النهائية؟ | — | _______ |

**نموذج الحل:**

| | `Minimax` | `Alpha-Beta` |
| --- | --- | --- |
| تعقيد زمني | $O(b^m)$ | $O(b^{m/2})$ |
| تعقيد مكاني | $O(bm)$ | $O(bm)$ |
| يقطع فروع؟ | لا | نعم |
| يغيّر النتيجة النهائية؟ | — | لا |

---

### تمرين 6: سيناريو تصميم — scenario

**المطلوب:**
اكتب pseudocode مختصر لدالة `EXPECT-MINIMAX` التي تتعامل مع `chance nodes` في ألعاب كـ `backgammon`.

**نموذج الحل:**
```text
// EXPECT-MINIMAX: handles MAX, MIN, and CHANCE nodes
function EXPECT-MINIMAX(state):
    if TERMINAL-TEST(state): return UTILITY(state)
    
    if MAX's turn:
        return MAX over a in ACTIONS(state) of EXPECT-MINIMAX(RESULT(a, state))
    
    else if MIN's turn:
        return MIN over a in ACTIONS(state) of EXPECT-MINIMAX(RESULT(a, state))
    
    else (CHANCE node — dice roll):
        // compute expected value over all outcomes
        return SUM over r in outcomes of:
               P(r) * EXPECT-MINIMAX(RESULT(r, state))
        // P(r) = probability of outcome r (e.g., 1/6 for each die face)
```

---

### تمرين 7: heuristic_eval — تقييم دالة

**المطلوب:**
قيّم جودة دوال التقييم التالية لـ `MAX` في الشطرنج:
1. `f(state) = عدد قطع MAX`
2. `f(state) = عدد قطع MAX - عدد قطع MIN`
3. `f(state) = (8×ملوك MAX + 5×وزراء) - (8×ملوك MIN + 5×وزراء MIN)`

**نموذج الحل:**

| الدالة | الجودة | السبب |
| --- | --- | --- |
| f=عدد قطع MAX فقط | ضعيفة | تجاهل قطع MIN — قد تختار حالة فيها خصمك أقوى |
| f=قطع MAX - قطع MIN | متوسطة | تأخذ الفارق في الاعتبار |
| f=أوزان مختلفة للقطع | جيدة | تعكس القيمة الحقيقية لكل قطعة |

---

### تمرين 8: scenario — تحليل مفهومي

**المطلوب:**
لاعب يستخدم `Minimax` ويواجه خصماً يلعب عشوائياً. هل `Minimax` استراتيجية مثالية هنا؟

**نموذج الحل:**
لا — ليست مثالية. `Minimax` يفترض أن الخصم **يلعب مثالياً** ويختار دائماً الحركة الأسوأ لك. مع خصم عشوائي:
- `Minimax` قد يفوت فرصاً لمكاسب أكبر (لأنه "حذر جداً")
- استراتيجية تستغل ضعف الخصم قد تكون أفضل
- مع ذلك: `Minimax` يضمن أسوأ حالة جيدة — لن تخسر ضد أي خصم بما فيهم المثالي

---

## الجزء الرابع: تمارين تحليل وتطبيق

> تمارين تحليلية إضافية — جداول ناقصة، إكمال أشجار بحث.

---

### تمرين 1: table_fill — جدول حالات Alpha-Beta

**السيناريو:**
شجرة Alpha-Beta (MAX → MIN → أوراق):
- MIN₁ أوراق: [4, 7]
- MIN₂ أوراق: [2, 9]
- MIN₃ أوراق: [6, 1]

**المطلوب:** أكمل جدول تتبع Alpha-Beta:

| الخطوة | العقدة | القيمة المرئية | α | β | هل حدث قطع؟ |
| --- | --- | --- | --- | --- | --- |
| 1 | MIN₁ - ورقة 4 | 4 | ? | ? | ? |
| 2 | MIN₁ - ورقة 7 | 7 | ? | ? | ? |
| 3 | MIN₁ محسوبة | 4 | ? | ? | ? |
| 4 | MIN₂ - ورقة 2 | 2 | ? | ? | ? |
| 5 | MIN₂ - ورقة 9 | ? | ? | ? | ? |
| 6 | MIN₂ محسوبة | ? | ? | ? | ? |
| 7 | MIN₃ - ورقة 6 | 6 | ? | ? | ? |
| 8 | MIN₃ - ورقة 1 | ? | ? | ? | ? |

**نموذج الحل:**

| الخطوة | العقدة | القيمة المرئية | α | β | هل حدث قطع؟ |
| --- | --- | --- | --- | --- | --- |
| 1 | MIN₁ - ورقة 4 | 4 | -∞ | +∞ | لا |
| 2 | MIN₁ - ورقة 7 | 7 | -∞ | +∞ | لا — min(4,7)=4 |
| 3 | MIN₁ محسوبة | 4 | α=4 | +∞ | لا — MAX يحدّث α=4 |
| 4 | MIN₂ - ورقة 2 | 2 | 4 | +∞ | v=2 ≤ α=4 → **α cutoff!** |
| 5 | MIN₂ - ورقة 9 | — | — | — | **مقطوعة** |
| 6 | MIN₂ محسوبة | ≤2 | 4 | — | مقطوعة |
| 7 | MIN₃ - ورقة 6 | 6 | 4 | +∞ | لا |
| 8 | MIN₃ - ورقة 1 | 1 | 4 | +∞ | v=1 ≤ α=4 → **α cutoff!** |

**النتيجة:** MAX يختار MIN₁ بقيمة **4**

---

### تمرين 2: diagram_completion — إكمال شجرة Minimax

**المطلوب:**
ارسم شجرة Minimax ذات 3 مستويات (MAX→MIN→أوراق) بـ branching factor=2، وأوراق [8,2,5,6,1,4,7,3]، وأكمل القيم.

**نموذج الحل:**
```
                       MAX: 5
                    /          \
               MIN: 2           MIN: 1
              /    \           /    \
          MAX:8  MAX:2     MAX:1   MAX:3
          / \    / \       / \     / \
         8   2  5   6     1   4   7   3
```

شرح: كل عقدة MAX داخلية = max لأوراقها → [8,2,5,6,1,4,7,3] → MAX([8,2])=8, MAX([5,6])=6, MAX([1,4])=4, MAX([7,3])=7 → ❌ تصحيح:

```
                        MAX: 6
                     /          \
               MIN: 6           MIN: 4
              /    \           /    \
             8      6         4      7
            / \    / \       / \    / \
           8   2  5   6     1   4  7   3
```

MIN₁ = min(8,6) = 6 | MIN₂ = min(4,7) = 4 | MAX = max(6,4) = **6**

---

### تمرين 3: written_analysis — تحليل مفهومي

**المطلوب:**
اشرح بجملتين لماذا $35^{50}$ أفضل من $35^{100}$ لكنه لا يزال غير كافٍ للشطرنج.

**نموذج الحل:**
$35^{50}$ تقريباً $10^{77}$ عملية — رغم أنه نصف أس $35^{100}$، إلا أنه لا يزال يتجاوز قدرات أسرع الحواسيب بمراحل. لذا حتى مع `Alpha-Beta` المثالي، الشطرنج يحتاج إلى `cutoff test` + `evaluation function` للعمل في الوقت الحقيقي.

---

### تمرين 4: heuristic_eval — مثال رقمي

**المطلوب:**
في مثال الـ 2-ply في المحاضرة (أوراق [3,12,8] [2,4,6] [14,5,2])، إذا طُبّق `Alpha-Beta` ابدأ من α=-∞، β=+∞:
- بعد MIN₁: ما قيمة α؟
- هل تُقطع فروع في MIN₂؟ لماذا؟

**نموذج الحل:**
- MIN₁ = min(3,12,8) = 3 → α = 3
- في MIN₂: أول ورقة = 2 → v = 2 ≤ α=3 → **α cutoff** → تُقطع الأوراق 4 و6
- في MIN₃: أول ورقة = 14 → v=14 > α=3 → لا قطع. ورقة 5 → v=5 > α=3 → لا قطع. ورقة 2 → v=2 ≤ α=3 → تُقطع (لكن كل الأوراق استُكشفت فعلاً)

---

## الجزء الرابع: تمارين تتبع الخوارزميات (خطوة بخطوة)

---

### تمرين تتبع 1: Minimax الكامل

**المدخل:**
```text
شجرة 2-ply (MAX → MIN):
- MIN_A: أوراق [5, 3, 7]
- MIN_B: أوراق [1, 8, 4]
- MIN_C: أوراق [6, 2, 9]
```

**أكمل الجدول:**

| الخطوة | العملية | الحالة (v) |
| --- | --- | --- |
| 1 | دخول MIN_A، زيارة 5 | ؟ |
| 2 | زيارة 3 في MIN_A | ؟ |
| 3 | زيارة 7 في MIN_A | ؟ |
| 4 | إرجاع MIN_A | ؟ |
| 5 | دخول MIN_B، زيارة 1 | ؟ |
| 6 | زيارة 8 في MIN_B | ؟ |
| 7 | زيارة 4 في MIN_B | ؟ |
| 8 | إرجاع MIN_B | ؟ |
| 9 | دخول MIN_C، زيارة 6 | ؟ |
| 10 | زيارة 2 في MIN_C | ؟ |
| 11 | زيارة 9 في MIN_C | ؟ |
| 12 | إرجاع MIN_C | ؟ |
| 13 | MAX يختار | ؟ |

**نموذج الحل:**

| الخطوة | العملية | الحالة (v) |
| --- | --- | --- |
| 1 | دخول MIN_A، زيارة 5 | v=5 |
| 2 | زيارة 3 | v=min(5,3)=3 |
| 3 | زيارة 7 | v=min(3,7)=3 |
| 4 | إرجاع MIN_A | **3** |
| 5 | دخول MIN_B، زيارة 1 | v=1 |
| 6 | زيارة 8 | v=min(1,8)=1 |
| 7 | زيارة 4 | v=min(1,4)=1 |
| 8 | إرجاع MIN_B | **1** |
| 9 | دخول MIN_C، زيارة 6 | v=6 |
| 10 | زيارة 2 | v=min(6,2)=2 |
| 11 | زيارة 9 | v=min(2,9)=2 |
| 12 | إرجاع MIN_C | **2** |
| 13 | MAX يختار | **max(3,1,2)=3 → MIN_A** |

**النتيجة:** MAX يختار الفرع A بقيمة **3**

---

### تمرين تتبع 2: Alpha-Beta خطوة بخطوة

**المدخل:**
```text
شجرة 2-ply (MAX → MIN):
- MIN_X: أوراق [7, 2]
- MIN_Y: أوراق [4, 9]
ابدأ بـ α=-∞، β=+∞
```

**أكمل الجدول:**

| الخطوة | العقدة | قيمة الورقة | v (عقدة MIN) | α | β | قطع؟ |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | MIN_X ورقة 7 | 7 | ؟ | ؟ | ؟ | ؟ |
| 2 | MIN_X ورقة 2 | 2 | ؟ | ؟ | ؟ | ؟ |
| 3 | إرجاع MIN_X | — | ؟ | ؟ | ؟ | — |
| 4 | MIN_Y ورقة 4 | 4 | ؟ | ؟ | ؟ | ؟ |
| 5 | MIN_Y ورقة 9 | 9 | ؟ | ؟ | ؟ | ؟ |

**نموذج الحل:**

| الخطوة | العقدة | قيمة الورقة | v (عقدة MIN) | α | β | قطع؟ |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | MIN_X ورقة 7 | 7 | 7 | -∞ | 7 | لا |
| 2 | MIN_X ورقة 2 | 2 | 2 | -∞ | 2 | لا |
| 3 | إرجاع MIN_X | — | **2** | α=2 | +∞ | — |
| 4 | MIN_Y ورقة 4 | 4 | 4 | 2 | 4 | v=4>α=2 → لا |
| 5 | MIN_Y ورقة 9 | 9 | 4 | 2 | 4 | v=min(4,9)=4>α=2 → لا |

**النتيجة:** MIN_X=2، MIN_Y=4، MAX يختار **MIN_Y=4**

---

### تمرين تتبع 3: تتبع قيم backed up في لعبة 3 لاعبين

**المدخل:**
```text
3 لاعبين (A→B→C→أوراق):
C الفروع: [1,5,2]  و  [4,3,2]
B يختار بناءً على قيمته (الرقم الأول في tuple)
A يختار بناءً على قيمته (الرقم الأول في الثلاثي)
Utility tuples الأوراق: [(1,5,2), (4,3,2), (6,1,2), (2,4,5)]
```

**المطلوب:** أكمل خطوات الـ backup:

| الخطوة | العقدة | الاختيار | القيمة المُرجعة |
| --- | --- | --- | --- |
| 1 | C₁ يختار من [(1,5,2),(4,3,2)] | ؟ | ؟ |
| 2 | C₂ يختار من [(6,1,2),(2,4,5)] | ؟ | ؟ |
| 3 | B يختار من نتيجتي C₁،C₂ | ؟ | ؟ |

**نموذج الحل:**

| الخطوة | العقدة | الاختيار | القيمة المُرجعة |
| --- | --- | --- | --- |
| 1 | C (قيمة C = رقم 3) → max قيمة C: 5 vs 3 | يختار (1,5,2) | **(1,5,2)** |
| 2 | C (قيمة C = رقم 3) → max قيمة C: 2 vs 5 | يختار (2,4,5) | **(2,4,5)** |
| 3 | B (قيمة B = رقم 2) → max قيمة B: 5 vs 4 | يختار (1,5,2) | **(1,5,2)** |

**النتيجة:** A يرى (1,5,2) من الفرع المختار

---

### تمرين تتبع 4: Alpha-Beta على شجرة كاملة من المحاضرة

**المدخل:**
```text
شجرة من المحاضرة (صفحة 26): MAX → MIN → MAX → MIN → أوراق
قيم الأوراق (من اليسار):
L=[a=8,b=5] M=[c=15] N=[d=20,e=23,f=3]
P=[g=10,h=11] Q=[i=12] R=[j=8,k=6]
S=[l=20] T=[m=12,n=6] U=[o=7]
V=[p=7] W=[q=8,r=1] X=[s=10,t=12] Y=[u=20,v=5]
```

**المطلوب:** ما هو الـ Minimax value للجذر A وأي فرع يختاره؟

**نموذج الحل (مبسط):**
- E = max(min(8,5), min(15,...)) → الشجرة معقدة، المحاضرة تُظهر B=12، C=8 في صورة نموذجية
- من صفحة 27: A=12، المختار = الفرع الأول (B=12)
- Alpha-Beta تقطع عدة فروع (مُعلَّمة بالرمز ⚡ في المحاضرة)

**النتيجة:** A = **12**، MAX يختار الفرع الأيسر B

---

## الجزء الرابع: أسئلة تصميم

---

### سؤال تصميم 1: تصميم شجرة Minimax لـ Tic-Tac-Toe — uml_design

**المطلوب:**
ارسم مخطط `game tree` للحالة التالية في `Tic-Tac-Toe`:

```
X | _ | _
_ | _ | _
_ | _ | _
```

وضّح: أول طبقتين من التوسع (MAX → MIN) مع `Utility` للأوراق القريبة.

**نموذج الإجابة:**

```diagram
type: decision-tree
title: Tic-Tac-Toe State Tree (2 levels)
direction: TD
nodes:
  - id: root
    label: "X في (1,1) — الحالة الابتدائية"
    kind: max_node
    level: 0
  - id: n1
    label: "O في (1,2)"
    kind: min_node
    level: 1
  - id: n2
    label: "O في (1,3)"
    kind: min_node
    level: 1
  - id: n3
    label: "O في (2,1)"
    kind: min_node
    level: 1
  - id: n4
    label: "..."
    kind: min_node
    level: 1
  - id: l1
    label: "X في (2,1)"
    kind: max_node
    level: 2
  - id: l2
    label: "..."
    kind: max_node
    level: 2
edges:
  - from: root
    to: n1
  - from: root
    to: n2
  - from: root
    to: n3
  - from: root
    to: n4
  - from: n1
    to: l1
  - from: n1
    to: l2
```

**معايير التقييم:**
- تناوب طبقات MAX (X) و MIN (O) بشكل صحيح
- كل حركة من الحالة الأم تؤدي لحالة ابنة مختلفة
- الأوراق تحمل `Utility` ∈ {-1, 0, +1}
- اتجاه الشجرة من الأعلى للأسفل (`TD`)

---

### سؤال تصميم 2: تصميم نظام بحث لعبة شطرنج — architecture

**المطلوب:**
صمّم معمارية `agent` لبرنامج شطرنج يستخدم `Alpha-Beta` مع `cutoff` و`evaluation function`.

**نموذج الإجابة:**

```
[INPUT] ← حالة اللوح الحالية
    ↓
[State Representation] — تمثيل الحالة (قطع + مواضع)
    ↓
[Alpha-Beta Search Engine]
    ├── ALPHA-BETA-DECISION(state)
    ├── Cutoff Test: depth ≥ 6 plyies
    ├── Evaluation Function: weighted piece value
    └── Move Ordering: capture moves first
    ↓
[Best Action] ← الحركة الأفضل
    ↓
[OUTPUT] ← تنفيذ الحركة
```

**معايير التقييم:**
- وجود مكوّن `state representation` واضح
- وجود `cutoff test` بعمق محدد
- وجود `evaluation function` مناسبة
- وجود `move ordering` لتحسين Alpha-Beta
- تدفق واضح من الإدخال للإخراج

---

## الجزء الرابع: بطاقات سؤال وجواب (Q&A Cards)

---

**Q1:** ما الفرق بين `Minimax` ومسائل البحث العادية؟
**A:** في `Minimax` يوجد خصم يحاول إفشالك → الحل استراتيجية (`strategy`) تغطي كل ردوده، لا مسار واحد.

---

**Q2:** ما هي `Utility` في ألعاب الذكاء الاصطناعي؟
**A:** قيمة رقمية تُعبّر عن مدى جودة نهاية اللعبة للاعب (+1 فوز، 0 تعادل، -1 خسارة).

---

**Q3:** ما معنى `perfect information game`؟
**A:** لعبة يرى فيها كلا اللاعبين الحالة الكاملة (كل القطع والمواضع). مثال: شطرنج.

---

**Q4:** ما `branching factor` في الشطرنج؟
**A:** $b \approx 35$ أي حوالي 35 حركة ممكنة في كل وضع.

---

**Q5:** متى يكون `Minimax` مكتملاً (`complete`)؟
**A:** إذا كانت الشجرة محدودة الحجم (`finite tree`). الشطرنج له قواعد خاصة تضمن ذلك.

---

**Q6:** ما `Space complexity` لـ `Minimax`؟
**A:** $O(bm)$ — لأنه يستخدم `depth-first exploration` ويخزن مساراً واحداً فقط.

---

**Q7:** ماذا يعني `α` في `Alpha-Beta`؟
**A:** أفضل قيمة وجدها MAX حتى الآن على المسار الحالي — إذا وجد MIN ما هو أقل، يُقطع الفرع.

---

**Q8:** متى يحدث `α cutoff`؟
**A:** في `MIN-VALUE` عندما `v ≤ α` — MAX لن يختار هذا الفرع لأن لديه بديلاً أفضل.

---

**Q9:** هل `Alpha-Beta` يغيّر القرار النهائي مقارنة بـ `Minimax`؟
**A:** لا — يعطيان **دائماً** نفس القرار. الفرق في السرعة فقط.

---

**Q10:** ما `Time complexity` لـ `Alpha-Beta` في أفضل الأحوال؟
**A:** $O(b^{m/2})$ — يُضاعف عمق البحث القابل للحل بنفس الوقت.

---

**Q11:** ما الفرق بين `Minimax` في لعبتين مقابل ثلاثة لاعبين؟
**A:** مع ثلاثة لاعبين: `Utility` أصبح `tuple`، كل لاعب يعظّم قيمته الخاصة في `tuple`.

---

**Q12:** ما `ply` في شجرة اللعبة؟
**A:** حركة لاعب واحد. 2-ply = حركة + رد = دور كامل.

---

**Q13:** لماذا `backgammon` يُصنَّف `chance game`؟
**A:** لأن استخدام الزهر (`dice`) يضيف عشوائية لا يتحكم فيها اللاعب.

---

**Q14:** ما المقصود بـ `backed up` في شجرة اللعبة؟
**A:** نقل قيم `Utility` من الأوراق صاعداً للجذر عبر دوال MAX وMIN.

---

**Q15:** متى نستخدم `cutoff test` بدلاً من `terminal test`؟
**A:** عندما يكون عمق الشجرة كبيراً جداً — نوقف البحث عند عمق معين ونستخدم `evaluation function`.

---

**Q16:** ما مشكلة `horizon effect` في لعب الألعاب؟
**A:** عند استخدام `cutoff`، قد تقع أحداث مهمة جداً (خسارة قطعة مثلاً) بعد حد البحث مباشرة — يُخفق المحرك في رؤيتها.

---

**Q17:** من وضع أسس `Alpha-Beta Pruning`؟
**A:** `McCarthy` عام 1956 — أثبت أن بعض الفروع لا تؤثر على القرار ويمكن تجاهلها.

---

**Q18:** لماذا يقول `Samuel` (1952–57) استُخدم التعلم الآلي في الألعاب مبكراً؟
**A:** لتحسين دقة `evaluation function` عبر التعلم من الخبرة — بدلاً من برمجتها يدوياً.

---

## السيناريوهات المركّبة

---

### السيناريو 1: شجرة Alpha-Beta كاملة

> شجرة MAX → MIN بثلاثة فروع لكل عقدة:
> - MIN₁: أوراق [6, 3, 9]
> - MIN₂: أوراق [1, 8, 5]
> - MIN₃: أوراق [4, 7, 2]
> الشرط: α=-∞، β=+∞ ابتداءً

---

### السؤال 1.1 (hard):
ما قيمة MIN₁؟
أ) 9   ب) 3   ج) 6   د) 1

**الإجابة: ب**
**التعليل:** MIN₁ = min(6,3,9) = 3

---

### السؤال 1.2 (hard):
بعد حساب MIN₁=3، هل يقطع Alpha-Beta أي ورقة في MIN₂؟
أ) نعم — بعد ورقة 1
ب) نعم — بعد ورقة 8
ج) لا — يحسب كل الأوراق
د) نعم — بعد ورقة 5

**الإجابة: أ**
**التعليل:** α=3 بعد MIN₁. في MIN₂: ورقة 1 → v=1 ≤ α=3 → **α cutoff** فوراً → تُقطع 8 و5

---

### السؤال 1.3 (hard):
ما الحركة التي يختارها MAX؟
أ) MIN₁   ب) MIN₂   ج) MIN₃   د) لا يمكن التحديد

**الإجابة: ج**
**التعليل:** MIN₁=3، MIN₂≤1 (مقطوعة)، MIN₃=min(4,7,2)=2. MAX(3,≤1,2)=3 → يختار MIN₁

---

### السؤال 1.4 (medium):
كم ورقة وُفِّرت بالقطع؟
أ) 0   ب) 1   ج) 2   د) 3

**الإجابة: ج**
**التعليل:** قُطعت ورقتان (8 و5) من MIN₂

---

### السيناريو 2: تصحيح كود Minimax

> ```text
> function MAX-VALUE(state, α, β):
>     if TERMINAL-TEST(state): return UTILITY(state)
>     v ← 0
>     for (a,s) in SUCCESSORS(state):
>         v ← MAX(v, MIN-VALUE(s, α, β))
>         if v ≥ β: return v
>         α ← MAX(α, v)
>     return v
> ```

---

### السؤال 2.1 (hard):
ما الخطأ في الكود؟
أ) استخدام MAX بدلاً من MIN
ب) تهيئة `v ← 0` بدلاً من `v ← -∞`
ج) شرط القطع خاطئ
د) تحديث α خاطئ

**الإجابة: ب**
**التعليل:** `v ← 0` تعني أن أي فرع بقيمة سالبة لن يُختار حتى لو كان الأفضل المتاح. `v ← -∞` ضروري لضمان أن أي قيمة تحدّث v.

---

### السؤال 2.2 (hard):
إذا كانت كل قيم الأوراق سالبة (مثل [-5,-3,-7])، ماذا ستُعيد هذه الدالة الخاطئة؟
أ) -3   ب) 0   ج) -7   د) -5

**الإجابة: ب**
**التعليل:** لأن `v=0` ولا توجد قيمة أكبر من 0 في الأوراق → `v` لا يُحدَّث → تُعيد 0 (خاطئ)

---

### السؤال 2.3 (medium):
هل التصحيح التالي كافٍ؟ `v ← -1000`
أ) نعم — بما يكفي للألعاب العملية
ب) لا — يجب `v ← -∞`
ج) نعم — لأن Utility عادةً بين -100 و+100
د) لا — يجب `v ← +∞`

**الإجابة: ب**
**التعليل:** استخدام `-1000` أفضل لكن غير صحيح من الناحية النظرية — إذا كانت `Utility` قد تكون أقل من -1000 ستفشل. `-∞` هي الإجابة الصحيحة نظرياً.

---

## الجزء الخامس: الخوارزميات الكاملة (مرجع Pseudocode)

> مرجع `pseudocode` كامل — بدون شرح جديد. كل خوارزمية في كتلة مستقلة.

---

```text
// ============================================================
// MINIMAX — Perfect play for 2-player, zero-sum, deterministic games
// ============================================================

function MINIMAX-DECISION(state) returns action:
    return argmax_{a in ACTIONS(state)} MIN-VALUE(RESULT(a, state))

function MAX-VALUE(state) returns utility:
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← -∞
    for each (a, s) in SUCCESSORS(state):
        v ← MAX(v, MIN-VALUE(s))
    return v

function MIN-VALUE(state) returns utility:
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← +∞
    for each (a, s) in SUCCESSORS(state):
        v ← MIN(v, MAX-VALUE(s))
    return v
```

---

```text
// ============================================================
// ALPHA-BETA PRUNING — Optimized Minimax with branch pruning
// ============================================================

function ALPHA-BETA-DECISION(state) returns action:
    return argmax_{a in ACTIONS(state)} MIN-VALUE(RESULT(a, state), -∞, +∞)

function MAX-VALUE(state, α, β) returns utility:
    // α = best value MAX found along path to state
    // β = best value MIN found along path to state
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← -∞
    for each (a, s) in SUCCESSORS(state):
        v ← MAX(v, MIN-VALUE(s, α, β))
        if v ≥ β: return v    // β cutoff
        α ← MAX(α, v)
    return v

function MIN-VALUE(state, α, β) returns utility:
    // α = best value MAX found along path to state
    // β = best value MIN found along path to state
    if TERMINAL-TEST(state): return UTILITY(state)
    v ← +∞
    for each (a, s) in SUCCESSORS(state):
        v ← MIN(v, MAX-VALUE(s, α, β))
        if v ≤ α: return v    // α cutoff
        β ← MIN(β, v)
    return v
```

---

```text
// ============================================================
// EXPECTIMINIMAX — Minimax extended with chance nodes
// ============================================================

function EXPECTIMINIMAX(state) returns utility:
    if TERMINAL-TEST(state): return UTILITY(state)

    if state is MAX turn:
        return MAX_{a} EXPECTIMINIMAX(RESULT(a, state))

    if state is MIN turn:
        return MIN_{a} EXPECTIMINIMAX(RESULT(a, state))

    if state is CHANCE node:
        return SUM_{r in outcomes} P(r) * EXPECTIMINIMAX(RESULT(r, state))
        // P(r) = probability of random outcome r
```

---

```text
// ============================================================
// MINIMAX with CUTOFF + EVALUATION FUNCTION
// ============================================================

function H-MINIMAX-DECISION(state, d_max) returns action:
    return argmax_{a in ACTIONS(state)} MIN-VALUE(RESULT(a, state), d_max, 0)

function MAX-VALUE(state, d_max, d) returns value:
    if CUTOFF-TEST(state, d, d_max): return EVAL(state)   // stop before terminal
    v ← -∞
    for each (a, s) in SUCCESSORS(state):
        v ← MAX(v, MIN-VALUE(s, d_max, d+1))
    return v

function MIN-VALUE(state, d_max, d) returns value:
    if CUTOFF-TEST(state, d, d_max): return EVAL(state)
    v ← +∞
    for each (a, s) in SUCCESSORS(state):
        v ← MIN(v, MAX-VALUE(s, d_max, d+1))
    return v

function CUTOFF-TEST(state, d, d_max) returns bool:
    return TERMINAL-TEST(state) or d >= d_max   // stop at max depth

function EVAL(state) returns number:
    return count_weighted_pieces(MAX, state) - count_weighted_pieces(MIN, state)
    // positive = advantage for MAX
```

---

## الجزء الخامس: أسئلة نظرية متوقعة بالامتحان

---

### السؤال 1: ما هو `Minimax`؟ ومتى نستخدمه؟

**نموذج الإجابة:**
1. **التعريف:** خوارزمية لاتخاذ القرار الأمثل في ألعاب `2-player`، `deterministic`، `perfect information`، من خلال التناوب بين تعظيم وتصغير قيمة `Utility`.
2. **المكونات:** `MAX-VALUE`، `MIN-VALUE`، `TERMINAL-TEST`، `UTILITY`، `SUCCESSORS`
3. **مثال:** تحديد أفضل حركة في الشطرنج أو `Tic-Tac-Toe`
4. **متى نستخدم:** عندما نريد لعباً مثالياً مضموناً في ألعاب ذات معلومات كاملة وحجم شجرة قابل للحساب

---

### السؤال 2: ما هو `Alpha-Beta Pruning` وكيف يعمل؟

**نموذج الإجابة:**
1. **التعريف:** تحسين لـ `Minimax` يحذف الفروع التي لن تؤثر على القرار النهائي دون تغيير الإجابة.
2. **المكونات:** معاملان إضافيان α و β يُمرَّران لكل دالة استدعاء.
3. **مثال:** إذا وجد MAX بديلاً = 5، وفي الفرع التالي وجد MIN قيمة = 3 → لا حاجة لباقي الفرع.
4. **متى نستخدم:** دائماً مع `Minimax` لأنه لا يُغيّر الإجابة ويُحسّن الكفاءة.

---

### السؤال 3: ما الفرق بين `zero-sum` و`non-zero-sum` games؟

**نموذج الإجابة:**
1. **التعريف:** `zero-sum` = مجموع مكاسب اللاعبين ثابت (ما يكسبه أحد يخسره الآخر). `non-zero-sum` = يمكن للطرفين الكسب أو الخسارة.
2. **المكونات:** `Utility` = عدد واحد في `zero-sum`، `utility tuple` في `non-zero-sum`.
3. **مثال:** الشطرنج `zero-sum`، لعبة الصيد التعاوني `non-zero-sum`.
4. **متى نستخدم:** الألعاب الكلاسيكية عادةً `zero-sum`، المفاوضات والتعاون `non-zero-sum`.

---

### السؤال 4: ما تعقيد `Minimax` الزمني والمكاني؟ ولماذا الشطرنج مستحيل؟

**نموذج الإجابة:**
1. **التعريف:** `Time = O(b^m)`، `Space = O(bm)` حيث b = `branching factor`، m = `depth`.
2. **المكونات:** استكشاف `depth-first` يُوفّر في المكان.
3. **مثال:** الشطرنج: b=35، m=100 → $35^{100} \approx 10^{154}$ عملية.
4. **متى نستخدم:** `Minimax` الكامل فقط للألعاب الصغيرة (Tic-Tac-Toe)، للكبيرة: `cutoff` + `evaluation`.

---

### السؤال 5: لماذا `α` يُحدَّث في `MAX-VALUE` وليس `MIN-VALUE`؟

**نموذج الإجابة:**
1. **التعريف:** α = أفضل قيمة وجدها MAX حتى الآن → يُحدَّث عندما يجد MAX قيمة أكبر.
2. **المكونات:** `α ← MAX(α, v)` في `MAX-VALUE` فقط.
3. **مثال:** MAX وجد فرعاً بقيمة 5 → α=5. الآن في الفرع التالي، MIN يختبر قيماً — إذا وجد 3 → v=3 ≤ α=5 → قطع.
4. **متى نستخدم:** فهم هذا التمييز حاسم لتطبيق Alpha-Beta صحيحاً.

---

### السؤال 6: ما الفرق بين `terminal test` و`cutoff test`؟

**نموذج الإجابة:**
1. **التعريف:** `terminal test` يكتشف نهاية اللعبة الحقيقية (لا حركات ممكنة). `cutoff test` يوقف البحث عند عمق محدد أو شرط معين.
2. **المكونات:** `cutoff` يُكمل بـ `evaluation function` بدلاً من `utility`.
3. **مثال:** الشطرنج — `cutoff` عند عمق 6، ثم `eval` = فارق قيمة القطع.
4. **متى نستخدم:** `cutoff` مع الألعاب الكبيرة التي لا يمكن الوصول لنهايتها.

---

### السؤال 7: ما `ply` وكيف يختلف عن `depth`؟

**نموذج الإجابة:**
1. **التعريف:** `ply` = حركة لاعب واحد. `depth` = عدد الـ ply المُستكشفة.
2. **مثال:** `2-ply` = X يلعب ثم O يرد (دور كامل).
3. **ملاحظة:** `Minimax` 2-ply يُمثَّل بشجرة من 3 مستويات (جذر + طبقة MIN + أوراق).
4. **متى نستخدم:** في تحديد عمق البحث الفعلي (`cutoff depth`).

---

### السؤال 8: ما الفرق بين الألعاب ذات المعلومات الكاملة والناقصة؟

**نموذج الإجابة:**
1. **التعريف:** `perfect information` = كل لاعب يرى الحالة الكاملة. `imperfect information` = بعض المعلومات مخفية.
2. **أمثلة:** شطرنج = `perfect`، بوكر = `imperfect`.
3. **التأثير على الخوارزميات:** `imperfect information` تحتاج `belief states` وخوارزميات مختلفة.
4. **متى نستخدم:** `Minimax` يُطبَّق مباشرةً على `perfect information`، أما `imperfect` تحتاج امتدادات.

---

### السؤال 9: ما خاصية `complete` لـ `Minimax`؟ وما الاستثناء؟

**نموذج الإجابة:**
1. **التعريف:** `complete` = تضمن إيجاد حل إذا وُجد.
2. **الشرط:** `Minimax` مكتمل **فقط** إذا كانت الشجرة محدودة (`finite`).
3. **الاستثناء:** قد تكون الشجرة لا نهائية نظرياً (لعبة لا تنتهي) لكن قد تكون هناك استراتيجية منتهية (`finite strategy`).
4. **تطبيق:** الشطرنج له قواعد تضمن انتهاء اللعبة.

---

### السؤال 10: ما المقصود بـ `backed up` في شجرة اللعبة؟

**نموذج الإجابة:**
1. **التعريف:** نقل قيم `Utility` من الأوراق (نهايات اللعبة) صاعداً عبر الشجرة لحساب قيمة كل عقدة داخلية.
2. **آلية:** كل عقدة MAX تأخذ `max` أبنائها، كل MIN تأخذ `min` أبنائها.
3. **مثال:** ورقة بـ `Utility=5` تُساهم في حساب قيمة عقدة MIN أعلاها.
4. **أهمية:** هو ما يجعل القرار عند الجذر يعكس عواقب جميع الحركات الممكنة.

---

## الجزء السادس: قائمة فحص ذاتي قبل الامتحان ✅

- [ ] أفهم الفرق بين مسألة البحث العادية والألعاب (`strategy` vs `path`)
- [ ] أستطيع تصنيف أي لعبة في جدول (deterministic/chance) × (perfect/imperfect)
- [ ] أستطيع رسم شجرة اللعبة بطبقات MAX وMIN بشكل صحيح
- [ ] أفهم كيف تُحسب `Minimax value` بالصعود من الأوراق للجذر (`backed up`)
- [ ] أستطيع كتابة pseudocode لـ `MAX-VALUE` و`MIN-VALUE` من الذاكرة
- [ ] أعرف لماذا تُهيَّأ v بـ -∞ في MAX وبـ +∞ في MIN
- [ ] أفهم `α` و`β` وأي منهما يُحدَّث في أي دالة
- [ ] أستطيع تطبيق `α cutoff` و`β cutoff` على مثال رقمي
- [ ] أعرف أن `Alpha-Beta` يعطي نفس نتيجة `Minimax` (لا تغيير في الإجابة)
- [ ] أحفظ التعقيد الزمني: `Minimax = O(b^m)`، `Alpha-Beta = O(b^{m/2})`
- [ ] أحفظ التعقيد المكاني = $O(bm)$ لكليهما
- [ ] أعرف قيم الشطرنج: b≈35، m≈100، ولماذا الحل الكامل مستحيل
- [ ] أفهم `utility tuple` في الألعاب متعددة اللاعبين
- [ ] أفهم دور `evaluation function` و`cutoff test` في الألعاب الكبيرة
- [ ] أعرف الفرق بين `zero-sum` و`non-zero-sum`
- [ ] أستطيع تتبع `Alpha-Beta` خطوة بخطوة على شجرة من 3 مستويات

---

## الجزء السادس: ورقة المراجعة السريعة (Cheat Sheet)

### 🔑 خريطة العلاقات بين المحاضرات

| المحاضرة | ترتبط مع | كيف؟ |
| --- | --- | --- |
| لعب الألعاب (7) | البحث (3–5) | `Minimax` هو `DFS` مُحوَّر لبيئة تنافسية |
| لعب الألعاب (7) | Local Search (6) | `cutoff` + `eval` يشبه التقريب في Local Search |
| لعب الألعاب (7) | Intelligent Agents (2) | اللاعب وكيل يحاول تعظيم `utility` |

---

### 🔑 أهم النقاط الذهبية

| الموضوع | النقاط |
| --- | --- |
| `Minimax` | يضمن الأفضل ضد خصم مثالي |
| `Alpha-Beta` | نفس الإجابة، ضعف العمق |
| `α cutoff` | في MIN-VALUE عند `v ≤ α` |
| `β cutoff` | في MAX-VALUE عند `v ≥ β` |
| الشطرنج | $35^{100}$ → مستحيل → `cutoff` + `eval` |
| `utility tuple` | للألعاب متعددة اللاعبين non-zero-sum |

---

### 🔑 مرجع سريع

| الرمز/المصطلح | المعنى | يُستخدم في |
| --- | --- | --- |
| $b$ | `branching factor` | حساب التعقيد |
| $m$ | عمق الشجرة (`depth`) | حساب التعقيد |
| $O(b^m)$ | تعقيد `Minimax` الزمني | المقارنة مع Alpha-Beta |
| $O(b^{m/2})$ | تعقيد Alpha-Beta (أفضل حالة) | تقييم الكفاءة |
| $O(bm)$ | تعقيد مكاني لكليهما | تقييم الذاكرة |
| `α` | أفضل قيمة MAX على المسار | Alpha-Beta MAX-VALUE |
| `β` | أفضل قيمة MIN على المسار | Alpha-Beta MIN-VALUE |
| `Utility` | قيمة نهاية اللعبة | Minimax، أوراق الشجرة |
| `ply` | حركة لاعب واحد | تحديد عمق البحث |
| `backed up` | نقل القيم من الأوراق للجذر | حساب Minimax value |

---

### 🔑 قواعد ذهبية لا تُنسى

| # | القاعدة |
| --- | --- |
| 1 | `Alpha-Beta` = `Minimax` لكن أسرع — لا تغيير في القرار |
| 2 | `v ← -∞` في MAX، `v ← +∞` في MIN |
| 3 | `α` يُحدَّث في MAX-VALUE، `β` يُحدَّث في MIN-VALUE |
| 4 | `α cutoff` في MIN-VALUE (`v ≤ α`)، `β cutoff` في MAX-VALUE (`v ≥ β`) |
| 5 | كلما كان ترتيب الحركات أفضل، زاد القطع في Alpha-Beta |
| 6 | `Minimax` مثالي ضد خصم مثالي فقط — لا ضد خصم عشوائي |
| 7 | الشطرنج: $35^{100}$ → استخدم `cutoff` + `evaluation function` |
| 8 | في الألعاب متعددة اللاعبين: `utility tuple` + كل لاعب يعظّم قيمته |

---

<!-- VALIDATION
lecture: 7
topic: Game Playing
coverage: complete
sections:
  - integration_map: ✅
  - detail: ✅ (11 sections)
  - summary: ✅
  - mcq: ✅ (18 questions)
  - debug_pseudocode: ✅ (6 questions)
  - exercise: ✅ (8 exercises)
  - analysis_exercise: ✅ (4 exercises)
  - trace_exercise: ✅ (4 exercises)
  - design_questions: ✅ (2 questions)
  - qa_cards: ✅ (18 cards)
  - scenario_clusters: ✅ (2 clusters × 3-4 questions)
  - reference_pseudocode: ✅ (4 algorithms)
  - theory_questions: ✅ (10 questions)
  - self_check: ✅
  - cheat_sheet: ✅
algorithms_covered:
  - Minimax
  - Alpha-Beta Pruning
  - Expectiminimax
  - Minimax with Cutoff
language_rules:
  - english_terms_in_backticks: ✅
  - no_code_languages_except_pseudocode: ✅
  - arabic_explanations: ✅
-->
