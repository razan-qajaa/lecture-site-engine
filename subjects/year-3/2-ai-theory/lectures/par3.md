# المحاضرة 8 — Logical Agent (الوكيل المنطقي)
> **المادة:** الذكاء الاصطناعي (القسم النظري) | **الموضوع:** `Knowledge-based Agents`، `Wumpus World`، `Propositional Logic`، `Entailment`، `Inference` (`Forward Chaining`، `Backward Chaining`، `Resolution`)

---

## 📌 خريطة التكامل (أين تقع هذه المحاضرة في الدورة؟)

| المرحلة | الأدوات | المخرجات |
| --- | --- | --- |
| Intelligent Agents | `PEAS`، `Environment Types` | تعريف الوكيل وبيئته |
| Problem Solving & Search | `BFS`، `DFS`، `A*` | إيجاد مسار للحل عبر البحث |
| **Logical Agent** ← أنت هنا | `Propositional Logic`، `Entailment`، `Forward/Backward Chaining`، `Resolution` | وكيل يستدل منطقياً على حقائق العالم (مثل `Wumpus World`) |
| First-Order Logic | `Quantifiers`، `Unification` | تمثيل أقوى من المنطق القضوي |
| Machine Learning | `Supervised`، `Optimization` | وكيل يتعلّم من البيانات بدل الاستدلال الصريح |

> **نوع هذه المحاضرة:** `Logical Agent` — التركيز على `Propositional Logic`، `Entailment`، `Resolution`، `Forward Chaining`، `Backward Chaining`.

---

## الجزء الأول: الشرح التفصيلي (سطر بسطر / فقرة بفقرة)

### 1. Knowledge-based Agents (الوكلاء القائمون على المعرفة)

#### النص الأصلي يقول:
> Knowledge base = set of sentences in a formal language
> Declarative approach to building an agent: TELL it what it needs to know
> Then it can ASK itself what to do—answers should follow from the KB
> Agents can be viewed at the knowledge level (what they know) or implementation level (data structures and algorithms)

#### الشرح المبسّط:
تخيّل عندك مساعد شخصي ما بيعرف شي أصلاً، بس أنت رح "تحكيله" (`TELL`) كل حقيقة يحتاجها عن العالم، وبعدين لما بدك قرار منه، بتسأله (`ASK`) وهو بيرجع جواب مبني **فقط** على اللي حكيته له (مش بيخترع معلومات). الـ `Knowledge Base` (KB) هو ببساطة مجموعة جمل (`sentences`) مكتوبة بلغة رسمية (formal language) زي المنطق.

**لماذا؟** لأنه بدل ما نكتب سطر برمجي منفصل لكل قرار ممكن يتخذه الوكيل (وهذا صعب وغير مرن)، نعطيه **معرفة عامة + قواعد استدلال**، وهو بنفسه يستنتج القرار الصح — هاد اسمه `Declarative approach`.

#### 💡 التشبيه:
> متل ما بتحكي لصديقك "الجو بره غيم وفي رعد" (TELL)، وبعدين تسأله "خذ مظلة ولا لأ؟" (ASK) وهو بيستنتج الجواب من المعلومة يلي حكيتها له — مش لازم تحكيله مباشرة "خذ مظلة".
> **وجه الشبه:** المعلومة المعطاة = TELL، السؤال المبني عليها = ASK.

#### KB-Agent Function

```text
// KB-AGENT function: the general loop of a knowledge-based agent
function KB-AGENT(percept) returns an action
    static: KB, a knowledge base            // stores everything the agent knows
            t, a counter, initially 0        // tracks time step

    TELL(KB, MAKE-PERCEPT-SENTENCE(percept, t))   // add what was perceived now
    action <- ASK(KB, MAKE-ACTION-QUERY(t))        // ask KB what to do now
    TELL(KB, MAKE-ACTION-SENTENCE(action, t))      // record the action taken
    t <- t + 1
    return action
```

#### شرح كل سطر:
1. `static: KB, t` → متغيرات ثابتة تُحفظ بين الاستدعاءات — لازم الوكيل "يتذكر" معرفته وزمنه عبر الزمن.
2. `TELL(KB, MAKE-PERCEPT-SENTENCE(percept, t))` → يحوّل الإدراك الحالي (`percept`) إلى جملة منطقية ويضيفها لـ KB.
3. `action <- ASK(KB, MAKE-ACTION-QUERY(t))` → يسأل KB: "شو أفضل إجراء بالوقت t؟" ويستنتج الجواب من كل المعرفة المتوفرة.
4. `TELL(KB, MAKE-ACTION-SENTENCE(action, t))` → يسجّل الإجراء نفسه كحقيقة جديدة (مفيد لاستدلالات لاحقة).
5. `t <- t + 1; return action` → يتقدّم الزمن ويرجّع القرار.

**الناتج المتوقع:**
> إجراء (`action`) واحد بكل خطوة زمنية، مبني بالكامل على محتوى KB.

**متطلبات الوكيل حسب المحاضرة:**
- تمثيل الحالات والإجراءات (`Represent states, actions`)
- دمج الإدراكات الجديدة (`Incorporate new percepts`)
- تحديث تمثيله الداخلي للعالم (`Update internal representations`)
- استنتاج الخصائص المخفية (`Deduce hidden properties`)
- استنتاج الإجراء المناسب (`Deduce appropriate actions`)

---

### 2. Wumpus World — PEAS Description

#### النص الأصلي يقول:
> Performance measure: gold +1000, death -1000, -1 per step, -10 for using the arrow
> Environment: Squares adjacent to wumpus are smelly, squares adjacent to pit are breezy, glitter iff gold in same square, shooting kills wumpus if facing it, shooting uses the only arrow, grabbing picks up gold, releasing drops gold
> Actuators: Left turn, Right turn, Forward, Grab, Release, Shoot
> Sensors: Breeze, Glitter, Smell

#### الشرح المبسّط:
`Wumpus World` هو "لعبة" افتراضية بشبكة مربعات، فيها وحش (Wumpus) ومطبّات (Pits) وذهب (Gold). الوكيل بده يجمع الذهب ويرجع بأمان، وبنفس الوقت يتجنب الموت (يقع بمطبّة أو الوحش ياكله). الـ `PEAS` (Performance, Environment, Actuators, Sensors) هو إطار وصف كامل لأي وكيل — سبق شرحه بمحاضرة `Intelligent Agents` **(شرح زيادة للفهم)**.

**لماذا؟** لأنه قبل ما نبني وكيل منطقي، لازم نعرف **بالضبط** شو بيحس وشو بيقدر يعمل — هاد بيحدد شكل الجمل المنطقية اللي رح نبنيها لاحقاً.

#### 💡 التشبيه:
> متل لعبة "الغميضة" بغرفة معتمة: ما بتشوف كل الغرفة، بس بتحس بأشياء حواليك (تيار هوا = مطبة قريبة، ريحة = وحش قريب) وبناءً عليها بتقرر وين تمشي.
> **وجه الشبه:** `Breeze` = تيار الهوا، `Smell` = الريحة، الحركة الحذرة = اتخاذ القرار من إحساس غير مباشر.

---

### 3. Wumpus World Characterization (توصيف بيئة Wumpus)

#### النص الأصلي يقول:
> Observable?? No—only local perception
> Deterministic?? Yes—outcomes exactly specified
> Episodic?? No—sequential at the level of actions
> Static?? Yes—Wumpus and Pits do not move
> Discrete?? Yes
> Single-agent?? Yes—Wumpus is essentially a natural feature

#### الشرح المبسّط:
هاي الأسئلة الستة هي **معايير تصنيف أي بيئة** لوكيل ذكي (`Environment Types`)، وتم تطبيقها هون على `Wumpus World`:

| المعيار | القيمة | السبب |
| --- | --- | --- |
| `Observable` | No (جزئي/`partially observable`) | الوكيل بس بيحس بالمربع المجاور (`local perception`) مش كل الخريطة |
| `Deterministic` | Yes | نتيجة كل فعل معروفة بالضبط، ما في عشوائية |
| `Episodic` | No (`sequential`) | كل قرار مرتبط بالقرارات السابقة (لازم تتذكر أين كنت) |
| `Static` | Yes | الوحش والمطبّات ما بيتحركوا وقت ما الوكيل يفكر |
| `Discrete` | Yes | عدد محدود من المربعات والإجراءات |
| `Single-agent` | Yes | الوحش مجرد "ميزة طبيعية" بالبيئة، مش لاعب له أهداف خاصة |

**لماذا هذا مهم؟** لأن `Partially Observable` + `Sequential` هما بالضبط سبب حاجتنا لـ `Logical Agent` يبني معرفة تراكمية عن المربعات غير المرئية بدل الاعتماد على إدراك لحظي فقط.

#### مهم للامتحان ⚠️:
> لازم تحفظ الستة معايير الترتيب: `Observable`, `Deterministic`, `Episodic`, `Static`, `Discrete`, `Single-agent` — أسئلة كثيرة بتجي بصيغة "ليش X = Yes/No؟".

---

### 4. Exploring a Wumpus World (مثال تتبّعي)

#### النص الأصلي يقول:
> السلسلة المصورة: الوكيل يبدأ بـ [1,1] `OK`، يتحرك لـ [2,1] فيحس `Breeze`، فيستنتج احتمال وجود `Pit` في [2,2] أو [3,1] (موسوم `P?`)... حتى يصل ليكتشف الذهب.

#### الشرح المبسّط:
هاي أمثلة توضح **كيف يبني الوكيل معرفته تدريجياً**:
1. يبدأ بمربع `[1,1]` آمن (`OK`) لأنه مكان الانطلاق.
2. يتحرك ويحس `Breeze` بـ`[2,1]` → يستنتج أن أحد المربعات المجاورة (`[2,2]` أو `[3,1]`) فيه احتمال `Pit` (يرمز له `P?`).
3. لاحقاً يحس `Smell` بمربع آخر → يشطب احتمال `Pit` بمربع كان مشكوك فيه (لأنه ثبت وجود Wumpus هناك بدل).
4. أخيراً يصل لمربع فيه `Glitter` → دليل قاطع أن الذهب بنفس المربع.

**لماذا؟** هاد بالضبط "الاستدلال المنطقي عملياً" — الوكيل ما بيخمّن، هو بيستبعد الاحتمالات المستحيلة منطقياً بناءً على القواعد (`Pits cause breezes in adjacent squares` مثلاً).

#### 🤔 تفعيل الفهم:
> **سؤال:** ليش ما نقدر نقول "[2,2] فيها Pit أكيد" بس من إحساس `Breeze` واحد بـ[2,1]؟
> **لماذا هذا مهم؟** لأن `Breeze` بـ[2,1] ممكن يكون سببها `Pit` بـ[1,1] أو [2,2] أو [3,1] — مش دليل قاطع على مربع محدد، لازم معلومات إضافية (breeze ثانية، أو غياب breeze بمربع آخر) لنحصر الاحتمال.

### 4.1 Other Tight Spots (حالات صعبة)

#### النص الأصلي يقول:
> Breeze in (1,2) and (2,1) ⇒ no safe actions
> Assuming pits uniformly distributed, (2,2) has pit w/ prob 0.86, vs. 0.31
> Smell in (1,1) ⇒ cannot move. Can use a strategy of coercion: shoot straight ahead — wumpus was there ⇒ dead ⇒ safe; wumpus wasn't there ⇒ safe

#### الشرح المبسّط:
أحياناً الاستدلال المنطقي البحت ما بيكفي (كل الخيارات فيها خطر محتمل)، فنلجأ لـ:
1. **الاستدلال الاحتمالي** (`probabilistic reasoning`): إذا اضطريت تخاطر، اختار المربع الأقل احتمال خطورة (0.31 أفضل من 0.86) **(غير مشروحة بالتفصيل بالمحاضرة، ذكرت كنتيجة رقمية فقط)**.
2. **استراتيجية الإكراه** (`coercion`): إذا كنت عالق (مثلاً تشم رائحة الوحش ولا تقدر تتحرك بأمان)، أطلق السهم للأمام — النتيجتين ممكنتين (الوحش مات، أو ما كان أصلاً هناك)، وبالحالتين المربع يصير آمن.

#### 💡 التشبيه:
> متل ما تطخّ رصاصة بالظلام لتتأكد ما في حدا بالغرفة — إذا كان في حدا بيروح الخطر، وإذا ما كان في حدا برضه ما في خطر. بكل الحالات الوضع بيصير أأمن.

---

### 5. Logic in General (المنطق بشكل عام)

#### النص الأصلي يقول:
> Logics are formal languages for representing information such that conclusions can be drawn
> Syntax defines the sentences in the language
> Semantics define the "meaning" of sentences; i.e., define truth of a sentence in a world
> E.g., x + 2 ≥ y is a sentence; x2 + y > is not a sentence

#### الشرح المبسّط:
أي منطق (logic) مبني من ركنين:
- **`Syntax`**: القواعد النحوية — شو الجملة المسموحة الصحيحة الشكل، وشو لأ (مثل `x + 2 ≥ y` جملة صحيحة، لكن `x2 + y >` غير صحيحة نحوياً).
- **`Semantics`**: المعنى — كيف نحدد إذا كانت الجملة صحيحة (`true`) أو خاطئة (`false`) بالنسبة لعالم معين (`world`)، مثلاً `x+2≥y` صح إذا `x=7, y=1` لكنها خطأ إذا `x=0, y=6`.

**لماذا؟** لأن الحاسوب ما بيفهم "معنى" — هو بيتعامل مع رموز (`syntax`) فقط، والـ `semantics` هي الجسر يلي بيربط هاي الرموز بالواقع.

#### 💡 التشبيه:
> `Syntax` متل قواعد اللغة العربية (تركيب الجملة صح نحوياً)، و`Semantics` متل فهمك لمعنى الجملة (هل هي صحيحة واقعياً أم لا).

---

### 6. Entailment (الاستلزام المنطقي)

#### النص الأصلي يقول:
> KB ⊨ α: Knowledge base KB entails sentence α if and only if α is true in all worlds where KB is true
> E.g., the KB containing "the Giants won" and "the Reds won" entails "Either the Giants won or the Reds won"
> Entailment is a relationship between sentences (syntax) that is based on semantics
> Note: brains process syntax (of some sort)

#### الشرح المبسّط:
`KB ⊨ α` تعني: كل مرة يكون فيها KB صحيح، لازم α يكون صحيح كمان — يعني α "نتيجة حتمية" لـ KB. هاد **مش** يعني KB بيحتوي على α حرفياً، بل يعني α **يلزم منطقياً** من KB.

**لماذا؟** هاد جوهر الاستدلال — إحنا مش بنبحث عن جمل موجودة حرفياً بـ KB، إحنا بنبحث عن **نتائج ملزَمة** منطقياً حتى لو ما انكتبت صراحة.

#### 💡 التشبيه:
> إذا حكيتلك "أحمد فاز" و"سامي فاز"، فأنت أكيد رح تستنتج "إما أحمد فاز أو سامي فاز" — حتى لو ما حكيتها صراحة، هي نتيجة حتمية من المعطيات.
> **وجه الشبه:** المعطيات = KB، النتيجة الحتمية = α.

---

### 7. Models (النماذج)

#### النص الأصلي يقول:
> Logicians typically think in terms of models, which are formally structured worlds with respect to which truth can be evaluated
> We say m is a model of a sentence α if α is true in m
> M(α) is the set of all models of α
> Then KB ⊨ α if and only if M(KB) ⊆ M(α)

#### الشرح المبسّط:
`Model` هو "عالم افتراضي" كامل التفاصيل نقدر نتحقق فيه من صحة جملة معينة. `M(α)` هي **كل** العوالم اللي تخلي α صحيحة. الاستلزام `KB ⊨ α` رياضياً هو ببساطة: **كل عالم يحقق KB لازم يكون ضمن العوالم اللي تحقق α** (أي `M(KB) ⊆ M(α)`).

**لماذا؟** لأن هاي الصياغة الرياضية (المجموعات) هي اللي بتخلينا نبني خوارزميات فعلية (زي `TT-Entails?`) للتحقق من الاستلزام آلياً.

#### 📊 المخطط: علاقة M(KB) و M(α)

#### ما هذا المخطط؟
> يوضح أن مجموعة عوالم KB يجب أن تكون مجموعة جزئية بالكامل من مجموعة عوالم α حتى يتحقق الاستلزام.

#### وصف العُقد:
| # | العُقدة | النوع `kind` | الشرح |
| --- | --- | --- | --- |
| 1 | M(α) | set | كل العوالم التي تجعل α صحيحة |
| 2 | M(KB) | set | كل العوالم التي تجعل KB صحيحة |

#### وصف الروابط:
| من | إلى | التسمية | نوع السهم | الشرح |
| --- | --- | --- | --- | --- |
| M(KB) | M(α) | subset ⊆ | احتواء | كل عالم لـ KB هو أيضاً عالم لـ α |

```diagram
type: class
title: Models Relationship
direction: TD
nodes:
  - id: M_alpha
    label: M(α)
    kind: set
    level: 0
  - id: M_KB
    label: M(KB)
    kind: set
    level: 1
edges:
  - from: M_KB
    to: M_alpha
```

---

### 8. Entailment in the Wumpus World (تطبيق عملي)

#### النص الأصلي يقول:
> Situation after detecting nothing in [1,1], moving right, breeze in [2,1]
> Consider possible models for ?s assuming only pits: 3 Boolean choices ⇒ 8 possible models
> α₁ = "[1,2] is safe", KB ⊨ α₁, proved by model checking
> α₂ = "[2,2] is safe", KB ⊭ α₂

#### الشرح المبسّط:
عندنا 3 مربعات مجهولة (Boolean: فيها Pit أو لأ) → 8 عوالم ممكنة (`2³`). طريقة `Model Checking` بسيطة: نعدّد **كل** العوالم الممكنة، ونستبعد اللي بتناقض معرفتنا (`KB` = قواعد Wumpus + الملاحظات)، وبعدين نتحقق: هل α صحيحة **بكل** العوالم الباقية؟
- `α₁` = "[1,2] آمن" → صحيحة بكل العوالم المتبقية ضمن KB → **`KB ⊨ α₁`**.
- `α₂` = "[2,2] آمن" → في عالم واحد على الأقل ضمن KB تكون فيه خاطئة → **`KB ⊭ α₂`** (لا نقدر نضمن أمانها).

#### 🔍 تتبع التنفيذ: Model Checking لـ [1,2]

**المدخل:** KB = وجود Breeze بـ[2,1] وعدم وجود Breeze بـ[1,1]، مع 3 متغيرات Boolean لمواقع محتملة للـ Pits.

| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | عدّد كل الـ 8 عوالم الممكنة | 8 تراكيب Boolean |
| 2 | استبعد العوالم التي تناقض KB (breeze rules) | تبقى 3 عوالم فقط |
| 3 | تحقق: هل [1,2]=Pit في أي من الـ3 عوالم الباقية؟ | لا |
| 4 | استنتج | KB ⊨ "[1,2] آمن" |

**النتيجة:** `[1,2]` آمن بشكل مؤكد منطقياً، بينما `[2,2]` غير مضمون.

---

### 9. Inference (الاستدلال) والصحّة والاكتمال

#### النص الأصلي يقول:
> KB ⊢ᵢ α = sentence α can be derived from KB by procedure i
> Consequences of KB are a haystack; α is a needle. Entailment = needle in haystack; inference = finding it
> Soundness: i is sound if whenever KB ⊢ᵢ α, it is also true that KB ⊨ α
> Completeness: i is complete if whenever KB ⊨ α, it is also true that KB ⊢ᵢ α

#### الشرح المبسّط:
`Entailment` (⊨) هو **علاقة موجودة أصلاً** بغض النظر عن أي خوارزمية (زي حقيقة رياضية). أما `Inference` (⊢ᵢ) فهو **خوارزمية فعلية** (procedure i) بنستخدمها لنكتشف تلك العلاقة.
- `Sound` (سليمة): كل شي تستنتجه الخوارزمية يكون **صحيح فعلاً** (ما بتكذب).
- `Complete` (كاملة): الخوارزمية قادرة على **إيجاد كل** النتائج الصحيحة (ما بتفوّت شي).

**لماذا؟** لأنه نبي خوارزمية `sound` (وإلا نستنتج أشياء خاطئة = خطيرة بـ Wumpus World!) و`complete` (وإلا نفوّت استنتاجات مفيدة موجودة فعلاً).

#### 💡 التشبيه:
> `Entailment` هو "الحقيقة الموجودة أصلاً" (الإبرة موجودة فعلاً بكومة القش)، و`Inference` هي "طريقتك بالبحث عنها". لو طريقتك دقيقة بس ما بتلاقي كل الإبر = sound بس مش complete. لو بتلاقي أشياء مو إبر أصلاً = مش sound.

---

### 10. Propositional Logic: Syntax (بناء المنطق القضوي)

#### النص الأصلي يقول:
> The proposition symbols P₁, P₂ etc are sentences
> If S is a sentence, ¬S is a sentence (negation)
> If S₁ and S₂ are sentences, S₁ ∧ S₂ is a sentence (conjunction)
> If S₁ and S₂ are sentences, S₁ ∨ S₂ is a sentence (disjunction)
> If S₁ and S₂ are sentences, S₁ ⇒ S₂ is a sentence (implication)
> If S₁ and S₂ are sentences, S₁ ⇔ S₂ is a sentence (biconditional)

#### الشرح المبسّط:
`Propositional Logic` (المنطق القضوي) أبسط منطق ممكن — كل رمز (`P₁`, `P₂`...) يمثل جملة كاملة يا إما صح يا إما خطأ (بدون تفاصيل داخلية زي "من" و"ماذا"، هذا الدور لـ `First-Order Logic` لاحقاً). نبنى جمل أعقد بربط الرموز بـ 5 روابط منطقية:

| الرمز | الاسم `English` | المعنى |
| --- | --- | --- |
| `¬` | `negation` | نفي (ليس) |
| `∧` | `conjunction` | و (كلاهما صحيح) |
| `∨` | `disjunction` | أو (أحدهما على الأقل) |
| `⇒` | `implication` | يستلزم (إذا... إذاً) |
| `⇔` | `biconditional` | إذا وفقط إذا |

#### 💡 التشبيه:
> الرموز (`P`, `Q`) متل كلمات مفردة، والروابط (`∧`, `∨`, `⇒`) متل حروف العطف والشرط اللي بتربطهم بجمل مركبة.

---

### 11. Propositional Logic: Semantics (الدلالة)

#### النص الأصلي يقول:
> Each model specifies true/false for each proposition symbol
> ¬S is true iff S is false
> S₁ ∧ S₂ is true iff S₁ is true and S₂ is true
> S₁ ∨ S₂ is true iff S₁ is true or S₂ is true
> S₁ ⇒ S₂ is true iff S₁ is false or S₂ is true (i.e., false iff S₁ true and S₂ false)
> S₁ ⇔ S₂ is true iff S₁ ⇒ S₂ is true and S₂ ⇒ S₁ is true

#### الشرح المبسّط:
كل `model` هو ببساطة تعيين true/false لكل رمز (مثلاً `P₁,₂=true, P₂,₂=true, P₃,₁=false`). ومن هاد التعيين، نقدر نحسب صحة أي جملة مركبة بخطوات بسيطة (recursive) عبر جدول الحقيقة `truth table`.

#### 📐 المعادلة: جدول الحقيقة للروابط

| P | Q | ¬P | P∧Q | P∨Q | P⇒Q | P⇔Q |
| --- | --- | --- | --- | --- | --- | --- |
| false | false | true | false | false | true | true |
| false | true | true | false | true | true | false |
| true | false | false | false | true | false | false |
| true | true | false | true | true | true | true |

**الشرح:**
> أخطر نقطة هون هي `P⇒Q`: هي **خاطئة فقط بحالة واحدة** (P صحيح وQ خاطئ). بكل الحالات الأخرى (بما فيها P خاطئ) تكون `P⇒Q` **صحيحة تلقائياً** — هذا يسمى "vacuous truth" **(شرح زيادة للفهم)**.

#### مثال حساب:
`¬P₁,₂ ∧ (P₂,₂ ∨ P₃,₁) = true ∧ (false ∨ true) = true ∧ true = true`

#### الفهم الخاطئ الشائع ❌: "الإلزام (⇒) زي السببية (يعني هذا بيسبب ذاك)"
#### الفهم الصحيح ✅: `⇒` مجرد علاقة منطقية بين قيم صح/خطأ، مو علاقة سببية زمنية.

---

### 12. Wumpus World Sentences (بناء KB فعلي)

#### النص الأصلي يقول:
> Let Pᵢ,ⱼ be true if there is a pit in [i,j]. Let Bᵢ,ⱼ be true if there is a breeze in [i,j]
> ¬P₁,₁ ; ¬B₁,₁ ; B₂,₁
> "Pits cause breezes in adjacent squares": B₁,₁ ⇔ (P₁,₂ ∨ P₂,₁), B₂,₁ ⇔ (P₁,₁ ∨ P₂,₂ ∨ P₃,₁)

#### الشرح المبسّط:
هون منطبّق كل الي شرحناه: نعرّف رموز (`Pᵢ,ⱼ`, `Bᵢ,ⱼ`) لكل مربع، ونكتب ملاحظاتنا كجمل بسيطة (`¬P₁,₁` = "ما في مطبة بـ[1,1]")، وقواعد العالم كجمل `⇔` (Biconditional) تربط السبب (وجود مطبة) بالنتيجة (الإحساس بـ Breeze).

**لماذا نستخدم `⇔` وليس `⇒`؟** لأننا نريد علاقة بالاتجاهين: "إذا في مطبة مجاورة فسنحس Breeze" **و** "إذا أحسسنا Breeze فلازم في مطبة مجاورة" (لنقدر نستنتج بالعكس أيضاً).

#### القواعد الكاملة (R1 إلى R5):
```text
R1: ¬P1,1
R2: B1,1 <=> (P1,2 v P2,1)
R3: B2,1 <=> (P1,1 v P2,2 v P3,1)
R4: ¬B1,1
R5: B2,1
```

---

### 13. Truth Table Inference — TT-Entails?

#### النص الأصلي يقول:
> Enumerate rows (different assignments to symbols), if KB is true in row, check that α is too

```text
// TT-ENTAILS?: check if KB entails alpha by exhaustive truth-table enumeration
function TT-ENTAILS?(KB, alpha) returns true or false
    symbols <- list of all proposition symbols in KB and alpha
    return TT-CHECK-ALL(KB, alpha, symbols, [])

// TT-CHECK-ALL: recursively try every true/false assignment
function TT-CHECK-ALL(KB, alpha, symbols, model) returns true or false
    if EMPTY?(symbols) then
        if PL-TRUE?(KB, model) then return PL-TRUE?(alpha, model)  // check alpha only when KB holds
        else return true                                            // KB false in this model -> vacuously ok
    else do
        P <- FIRST(symbols); rest <- REST(symbols)
        return TT-CHECK-ALL(KB, alpha, rest, EXTEND(P, true, model)) and
               TT-CHECK-ALL(KB, alpha, rest, EXTEND(P, false, model))
```

#### شرح كل سطر:
1. `symbols <- ...` → اجمع كل الرموز الفريدة الموجودة بـ KB و α.
2. `TT-CHECK-ALL(...)` → استدعِ الدالة العودية (recursive) اللي بتجرّب كل التوليفات.
3. `if EMPTY?(symbols)` → وصلنا لنموذج كامل (كل رمز أخذ قيمة true/false).
4. `if PL-TRUE?(KB, model) then return PL-TRUE?(alpha, model)` → إذا كان KB صحيح بهذا النموذج، لازم نتحقق أن α صحيح أيضاً — وإلا الاستلزام غير صحيح.
5. `else return true` → إذا KB خاطئ بهذا النموذج، ما يهمنا α هون (هذا النموذج غير ذي علاقة).
6. الجزء الأخير `else do` → يجرب الرمز الحالي مرة `true` ومرة `false` بشكل عودي على باقي الرموز.

**الناتج المتوقع:**
> `true` إذا كان α صحيحاً بكل نموذج يحقق KB (أي KB ⊨ α)، وإلا `false`.

#### مهم للامتحان ⚠️:
> تعقيد هذا الخوارزمية `O(2ⁿ)` لعدد n من الرموز، والمسألة `co-NP-complete` — يعني ما في حل أسرع معروف بالحالة العامة.

---

### 14. Logical Equivalence (التكافؤ المنطقي)

#### النص الأصلي يقول:
> Two sentences are logically equivalent iff true in same models: α ≡ β iff α ⊨ β and β ⊨ α
> يليها 10 قوانين: commutativity, associativity, double-negation elimination, contraposition, implication elimination, biconditional elimination, De Morgan (×2), distributivity (×2)

#### الشرح المبسّط:
`α ≡ β` تعني الجملتين "نفس الشيء منطقياً" (بيصحّوا ويخطأوا سوا بكل نموذج). هاي القوانين أدوات جاهزة لإعادة كتابة الجمل بشكل مكافئ — أهمها لعملنا لاحقاً هو `implication elimination`.

#### جدول القوانين الأساسية

| القانون | الصيغة | الاستخدام |
| --- | --- | --- |
| `Implication elimination` | `(α ⇒ β) ≡ (¬α ∨ β)` | أساسي لتحويل الجمل إلى CNF |
| `Biconditional elimination` | `(α ⇔ β) ≡ (α⇒β) ∧ (β⇒α)` | لتفكيك جمل الـ Wumpus World |
| `De Morgan` | `¬(α∧β) ≡ (¬α∨¬β)` و `¬(α∨β) ≡ (¬α∧¬β)` | لنقل النفي للداخل |
| `Double-negation` | `¬(¬α) ≡ α` | تبسيط |
| `Distributivity` | `α∧(β∨γ) ≡ (α∧β)∨(α∧γ)` | تحويل لـ CNF |

---

### 15. Validity and Satisfiability

#### النص الأصلي يقول:
> A sentence is valid if it is true in all models, e.g., True, A∨¬A, A⇒A
> Validity connected to inference via the Deduction Theorem: KB ⊨ α iff (KB ⇒ α) is valid
> A sentence is satisfiable if true in some model, e.g., A∨B, C
> A sentence is unsatisfiable if true in no models, e.g., A∧¬A
> KB ⊨ α iff (KB ∧ ¬α) is unsatisfiable — prove α by reductio ad absurdum

#### الشرح المبسّط:
- `Valid` (صحيحة دائماً / `tautology`): صحيحة بكل نموذج ممكن (مثل `A∨¬A`).
- `Satisfiable` (قابلة للتحقق): صحيحة بنموذج واحد على الأقل.
- `Unsatisfiable` (متناقضة): خاطئة بكل نموذج (مثل `A∧¬A`).

**النقطة الأهم عملياً:** `KB ⊨ α ⟺ (KB ∧ ¬α) unsatisfiable`. هاي هي أساس `Resolution`: بدل إثبات أن α صحيحة، نفترض عكسها (`¬α`) ونثبت أن هذا يقود لتناقض.

#### 💡 التشبيه:
> `Reductio ad absurdum` متل إثبات براءتك بالمحكمة: تفترض أنك مذنب، وتوصل لتناقض مستحيل (كنت بمكان تاني وقت الجريمة) → إذاً افتراض الذنب خاطئ = أنت بريء.

---

### 16. Proof Methods (طرق الإثبات)

#### النص الأصلي يقول:
> Application of inference rules — Proof = a sequence of inference rule applications, typically require translation into a normal form
> Model checking — truth table enumeration (always exponential in n), improved backtracking (e.g., DPLL), heuristic search in model space (sound but incomplete)

#### الشرح المبسّط:
في طريقتين رئيسيتين للإثبات:
1. **تطبيق قواعد استدلال** (`Forward/Backward Chaining`, `Resolution`) — سلسلة خطوات منطقية.
2. **`Model Checking`** — تعداد شامل (بطيء أسّياً)، أو `DPLL` (backtracking محسّن)، أو بحث تقريبي (سريع لكن غير مكتمل).

---

### 17. Forward and Backward Chaining — Horn Form

#### النص الأصلي يقول:
> Horn Form: KB = conjunction of Horn clauses. Horn clause = proposition symbol; or (conjunction of symbols) ⇒ symbol
> E.g., C ∧ (B⇒A) ∧ (C∧D⇒B)
> Modus Ponens (for Horn Form): complete for Horn KBs
> α₁,...,αₙ, α₁∧...∧αₙ ⇒ β ⊢ β
> Can be used with forward chaining or backward chaining. These algorithms are very natural and run in linear time

#### الشرح المبسّط:
`Horn Clause` شكل خاص ومحدود من الجمل (إما رمز مفرد، أو "شرط ⇒ نتيجة"). هذا التقييد **مهم جداً** لأنه بيخلي الاستدلال بسيط وسريع (`linear time`) عبر قاعدة `Modus Ponens`: إذا عندك كل الشروط (`α₁...αₙ`) صحيحة وعندك قاعدة تقول أن اجتماعهم يستلزم `β`، فـ`β` صحيحة أكيد.

**لماذا هذا التقييد مفيد؟** لأنه المنطق القضوي العام `co-NP-complete` (بطيء أسّياً)، لكن بحالة `Horn Form` الاستدلال بيصير خطي `O(n)` — مقايضة بين التعبيرية والسرعة.

#### ⚖️ المقايضة: Horn Form مقابل المنطق العام

| | Horn Form | General Propositional Logic |
| --- | --- | --- |
| المزايا | استدلال خطي `O(n)`، بسيط وطبيعي | تعبيري بالكامل، أي جملة ممكنة |
| العيوب | لا يمثل كل الجمل (مثل `A∨B` بدون شرط) | استدلال أسّي `O(2ⁿ)` |
| متى تختاره | أنظمة قواعد (Expert Systems) و KB بسيطة | مسائل منطقية عامة معقدة |

---

### 18. Forward Chaining (التسلسل الأمامي)

#### النص الأصلي يقول:
> Idea: fire any rule whose premises are satisfied in the KB, add its conclusion to the KB, until query is found
> مثال: P⇒Q, L∧M⇒P, B∧L⇒M, A∧P⇒L, A∧B⇒L, A, B

#### الشرح المبسّط:
`Forward Chaining` يبدأ من **الحقائق المعروفة** (`A`, `B`) ويطبّق القواعد اللي شروطها محقّقة، فيولّد حقائق جديدة (`L`, ثم `M`, ثم `P`, ثم `Q`)، ويكرر حتى يوصل للهدف أو ما عاد في قواعد جديدة ممكنة.

#### ⚙️ الخطوات / الخوارزمية: Forward Chaining (PL-FC-ENTAILS?)

#### ما هدف هذه العملية؟
> إثبات أن استعلام `q` مستلزَم من KB عبر توليد كل الحقائق الممكنة تدريجياً بدءاً من المعروف.

```algorithm
1 | تهيئة | count[c] لكل قاعدة | عدد مقدمات كل Horn clause
2 | تهيئة | inferred[p] لكل رمز | false للجميع
3 | تهيئة | agenda | كل الرموز المعروفة أصلاً في KB (هنا: A, B)
4 | استخراج | POP(agenda) | يسحب رمز p من القائمة
5 | فحص | unless inferred[p] | إذا لم يُستدل عليه سابقاً، تابع
6 | تحديث | inferred[p] <- true | تسجيل أن p أصبح معروفاً
7 | مسح | لكل قاعدة c يظهر فيها p بالمقدمة | decrement count[c]
8 | فحص | if count[c]=0 | كل مقدمات القاعدة أصبحت معروفة
9 | فحص هدف | if HEAD[c]=q | إذا كان استنتاج القاعدة هو الهدف q → أرجع true
10 | إضافة | PUSH(HEAD[c], agenda) | أضف الاستنتاج الجديد للقائمة ليُعالج لاحقاً
11 | نهاية | إذا فرغت agenda ولم يوجد q | أرجع false
```

#### نقاط التنفيذ:
- كل رمز يُعالَج **مرة واحدة فقط** بفضل `inferred[]` — هذا سبب الكفاءة الخطية.
- `count[c]` يشبه "عدّاد شروط ناقصة" لكل قاعدة، وعندما يصل لصفر تكون القاعدة "جاهزة للإطلاق" (fire).

#### 🔍 تتبع التنفيذ: مثال Forward Chaining الكامل

**المدخل:** KB = { P⇒Q, L∧M⇒P, B∧L⇒M, A∧P⇒L, A∧B⇒L, A, B }, الهدف q = Q

| الخطوة | العملية | الحالة (agenda / المستنتج) |
| --- | --- | --- |
| 1 | البداية | A, B معروفتان — count[A∧P⇒L]=2, count[A∧B⇒L]=2, count[B∧L⇒M]=2, count[L∧M⇒P]=2, count[P⇒Q]=1 |
| 2 | معالجة A | ينقص count[A∧P⇒L]→1, count[A∧B⇒L]→1 |
| 3 | معالجة B | ينقص count[A∧B⇒L]→0 (fire!) → L مستنتجة، ينقص count[B∧L⇒M]→1 |
| 4 | معالجة L | ينقص count[A∧P⇒L] (غير مؤثر)، ينقص count[L∧M⇒P]→1، ينقص count[B∧L⇒M]→0 (fire!) → M مستنتجة |
| 5 | معالجة M | ينقص count[L∧M⇒P]→0 (fire!) → P مستنتجة |
| 6 | معالجة P | ينقص count[P⇒Q]→0 (fire!) → Q مستنتجة = **الهدف!** |

**النتيجة:** `KB ⊢ Q` — تم إثبات `Q` عبر تسلسل: `A, B ⟹ L ⟹ M ⟹ P ⟹ Q`.

### 18.1 إثبات اكتمال Forward Chaining

#### النص الأصلي يقول:
> FC reaches a fixed point where no new atomic sentences are derived
> Consider the final state as a model m... every clause in the original KB is true in m
> If KB ⊨ q, q is true in every model of KB, including m

#### الشرح المبسّط:
البرهان يعتمد على فكرة ذكية: عندما يتوقف `FC` (يصل لـ `fixed point`)، نعتبر كل الرموز المستنتجة `true` والباقي `false` — هذا بحد ذاته **نموذج (model) صالح لـ KB بأكمله**. وبما أن أي جملة مستلزمة `α` لازم تكون صحيحة **بكل** نماذج KB، فهي صحيحة بهذا النموذج بالذات، وبالتالي FC لازم تكون استنتجته.

#### الدرس المستفاد:
> الفكرة العامة لإثبات الاكتمال: ابنِ أي نموذج لـ KB عبر استدلال سليم (sound)، ثم تحقق من α بذلك النموذج.

---

### 19. Backward Chaining (التسلسل الخلفي)

#### النص الأصلي يقول:
> Idea: work backwards from the query q: to prove q by BC, check if q is known already, or prove by BC all premises of some rule concluding q
> Avoid loops: check if new subgoal is already on the goal stack
> Avoid repeated work: check if new subgoal has already been proved true, or has already failed

#### الشرح المبسّط:
عكس `Forward Chaining` تماماً: نبدأ من **الهدف** (q) ونسأل: "شو القاعدة اللي بتثبت q؟"، وبعدين نحاول نثبت **مقدماتها** بنفس الطريقة، بشكل عودي (recursive)، حتى نوصل لحقائق معروفة أصلاً.

**لماذا نتجنب الحلقات (`loops`)؟** لأنه لو القاعدة تعتمد على نفسها بشكل غير مباشر (دائرية)، الخوارزمية ممكن تدخل بحلقة لا نهائية بدون فحص الـ `goal stack`.

#### 🔍 تتبع التنفيذ: مثال Backward Chaining

**المدخل:** نفس KB السابقة، الهدف q = Q

| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | الهدف: أثبت Q | ابحث عن قاعدة استنتاجها Q → `P⇒Q` |
| 2 | هدف فرعي: أثبت P | ابحث عن قاعدة → `L∧M⇒P` |
| 3 | هدف فرعي: أثبت L و M | لإثبات L: قاعدة `A∧B⇒L` (أسهل من A∧P⇒L لأن P غير مثبتة بعد) |
| 4 | أثبت A و B | A, B معروفتان مباشرة ✓ → L مثبتة |
| 5 | لإثبات M | قاعدة `B∧L⇒M`، B وL مثبتتان مسبقاً ✓ → M مثبتة |
| 6 | عد لإثبات P | L∧M مثبتتان ✓ → P مثبتة |
| 7 | عد لإثبات Q | P مثبتة ✓ → **Q مثبتة!** |

**النتيجة:** نفس النتيجة (`Q` صحيحة)، لكن الترتيب معكوس (من الهدف للحقائق).

---

### 20. Forward vs. Backward Chaining — مقارنة

#### النص الأصلي يقول:
> FC is data-driven, cf. automatic, unconscious processing, e.g., object recognition, routine decisions. May do lots of work that is irrelevant to the goal
> BC is goal-driven, appropriate for problem-solving, e.g., Where are my keys? How do I get into a PhD program?
> Complexity of BC can be much less than linear in size of KB

#### ⚖️ المقايضة: Forward Chaining مقابل Backward Chaining

| | Forward Chaining | Backward Chaining |
| --- | --- | --- |
| المزايا | يستنتج كل النتائج تلقائياً، مناسب لمعالجة تلقائية غير واعية | يبحث فقط بما هو ذو علاقة بالهدف، أسرع لأهداف محددة |
| العيوب | قد يعمل استنتاجات غير ذات علاقة بالهدف (تبذير) | لا يستنتج ما لم يُسأل عنه |
| متى تختاره | KB صغيرة نسبياً، أو نريد استنتاج كل شيء ممكن (مثل التعرف على الأنماط) | مسألة لها هدف واضح (حل مسائل، أسئلة محددة) |

#### 💡 التشبيه:
> `Forward Chaining` متل شخص بيقرأ الجريدة كل صباح ويستنتج كل الأخبار الممكنة (حتى لو ما تلزمه). `Backward Chaining` متل شخص عنده سؤال محدد ("وين مفاتيحي؟") وبيفكر بس بالمعلومات المتعلقة بهذا السؤال.

---

### 21. Resolution (الاستقصاء/الحل)

#### النص الأصلي يقول:
> Conjunctive Normal Form (CNF—universal): conjunction of disjunctions of literals (clauses)
> E.g., (A∨¬B) ∧ (B∨¬C∨¬D)
> Resolution inference rule (for CNF): complete for propositional logic
> ℓ₁∨...∨ℓₖ, m₁∨...∨mₙ ⊢ ℓ₁∨...∨ℓᵢ₋₁∨ℓᵢ₊₁∨...∨ℓₖ∨m₁∨...∨mⱼ₋₁∨mⱼ₊₁∨...∨mₙ where ℓᵢ and mⱼ are complementary literals
> E.g., P1,3∨P2,2, ¬P2,2 ⊢ P1,3
> Resolution is sound and complete for propositional logic

#### الشرح المبسّط:
`Resolution` هي قاعدة استدلال **واحدة فقط** لكنها **كاملة لكل المنطق القضوي** (بخلاف Modus Ponens اللي كانت محصورة بـ Horn Form). تعمل على جمل بصيغة `CNF` (اقتران من جمل-أو، كل جملة-أو تسمى `clause`).

**الفكرة:** إذا عندك جملتين تحتويان على `literal` متناقض (مثل `P2,2` بجملة و`¬P2,2` بجملة أخرى)، احذفهم وادمج الباقي بجملة واحدة جديدة.

#### 💡 التشبيه:
> متل ما تحل معادلة رياضية: `(X أو Y)` و`(ليس Y)` → إذاً `X` أكيد (لأن Y مستبعدة بالجملة الثانية، فلازم X تكون صح بالأولى).
> **وجه الشبه:** `Literal` متناقض = حد مشترك يُحذف، الباقي = النتيجة.

### 21.1 Conversion to CNF (خطوات التحويل)

#### النص الأصلي يقول:
> B1,1 ⇔ (P1,2 ∨ P2,1)
> 1. Eliminate ⇔, replacing α⇔β with (α⇒β)∧(β⇒α)
> 2. Eliminate ⇒, replacing α⇒β with ¬α∨β
> 3. Move ¬ inwards using De Morgan's rules and double-negation
> 4. Apply distributivity law (∨ over ∧) and flatten

#### الشرح المبسّط:
أي جملة منطقية، مهما كان شكلها، نقدر نحولها لصيغة CNF عبر 4 خطوات ثابتة — هاي الخطوات **إلزامية** قبل تطبيق Resolution لأنه Resolution بتشتغل بس على clauses.

#### ⚙️ الخطوات / الخوارزمية: Conversion to CNF

#### ما هدف هذه العملية؟
> تحويل أي جملة منطقية (تحتوي ⇔, ⇒, ¬ متداخلة) إلى صيغة CNF قياسية صالحة لـ Resolution.

```algorithm
1 | إزالة ⇔ | استبدال α⇔β بـ (α⇒β)∧(β⇒α) | (B1,1⇒(P1,2∨P2,1)) ∧ ((P1,2∨P2,1)⇒B1,1)
2 | إزالة ⇒ | استبدال α⇒β بـ ¬α∨β | (¬B1,1∨P1,2∨P2,1) ∧ (¬(P1,2∨P2,1)∨B1,1)
3 | نقل ¬ للداخل | تطبيق De Morgan و double-negation | (¬B1,1∨P1,2∨P2,1) ∧ ((¬P1,2∧¬P2,1)∨B1,1)
4 | توزيع | تطبيق distributivity ∨ على ∧ | (¬B1,1∨P1,2∨P2,1) ∧ (¬P1,2∨B1,1) ∧ (¬P2,1∨B1,1)
```

#### نقاط التنفيذ:
- الترتيب **ثابت وإلزامي**: ⇔ أولاً، بعدين ⇒، بعدين النفي، وأخيراً التوزيع.
- الناتج النهائي هو اقتران (`∧`) من عدة `clauses`، كل واحدة جاهزة لـ Resolution.

### 21.2 Resolution Algorithm

#### النص الأصلي يقول:
> Proof by contradiction, i.e., show KB ∧ ¬α unsatisfiable

```text
// PL-RESOLUTION: prove alpha via refutation (proof by contradiction)
function PL-RESOLUTION(KB, alpha) returns true or false
    clauses <- the set of clauses in the CNF representation of KB and not-alpha  // negate the goal
    new <- {}
    loop do
        for each Ci, Cj in clauses do          // try every pair of clauses
            resolvents <- PL-RESOLVE(Ci, Cj)    // resolve them if possible
            if resolvents contains the empty clause then return true  // contradiction found!
            new <- new union resolvents
        if new subset-of clauses then return false   // no new info -> cannot prove alpha
        clauses <- clauses union new
```

#### شرح كل سطر:
1. `clauses <- CNF(KB ∧ ¬alpha)` → نبدأ بافتراض عكس الهدف (`¬α`) مضافاً لـ KB — إذا وصلنا لتناقض، يبرهن هذا أن `α` صحيحة.
2. `for each Ci, Cj in clauses` → جرّب كل زوج ممكن من الجمل الحالية.
3. `resolvents <- PL-RESOLVE(Ci, Cj)` → طبّق قاعدة Resolution على الزوج.
4. `if resolvents contains the empty clause then return true` → الجملة الفارغة (`{}`) تعني تناقض مطلق (`False`) → إذاً KB∧¬α غير قابلة للتحقق → إذاً KB⊨α **صحيحة**.
5. `if new ⊆ clauses then return false` → إذا ما طلع أي شيء جديد (وصلنا نقطة ثابتة `fixed point`) بدون تناقض → α **غير مستلزمة**.

**الناتج المتوقع:**
> `true` إذا وُجد تناقض (يثبت KB⊨α)، أو `false` إذا استقرت مجموعة الجمل دون تناقض.

#### 🔍 تتبع التنفيذ: Resolution Example

**المدخل:** KB = (B1,1 ⇔ (P1,2∨P2,1)) ∧ ¬B1,1، الهدف α = ¬P1,2

| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | تحويل KB∧¬α إلى CNF | clauses = {¬P2,1∨B1,1, ¬B1,1∨P1,2∨P2,1, ¬P1,2∨B1,1, ¬B1,1, P1,2} |
| 2 | resolve(¬B1,1∨P1,2∨P2,1 , ¬B1,1) | ينتج: P1,2∨P2,1∨¬P1,2 (غير مفيد مباشرة، استمر) |
| 3 | resolve(¬P1,2∨B1,1 , ¬B1,1) | ينتج: ¬P1,2 |
| 4 | resolve(¬P1,2 , P1,2) | ينتج: **الجملة الفارغة `{}`** → تناقض! |

**النتيجة:** تم الوصول للجملة الفارغة → `KB ⊨ ¬P1,2` مُثبتة (وهذا يتوافق مع نتيجة `Model Checking` بالمربع `[1,2]` الآمن).

---

## الجزء الثاني: ملخص منظم

### أهم التعاريف والمفاهيم
| المصطلح | التعريف | مثال/ملاحظة |
| --- | --- | --- |
| `Knowledge Base (KB)` | مجموعة جمل بلغة رسمية تمثل معرفة الوكيل | مجموعة قواعد Wumpus World |
| `TELL` / `ASK` | إضافة معرفة / استعلام عن قرار | `TELL(KB, percept)` |
| `Entailment (⊨)` | نتيجة حتمية لجملة من أخرى بكل النماذج | `KB ⊨ α` |
| `Model` | عالم افتراضي يمكن تقييم صحة جملة فيه | تعيين true/false لكل رمز |
| `Inference (⊢ᵢ)` | خوارزمية فعلية لاستنتاج جمل من KB | `TT-Entails`, `Resolution` |
| `Sound` | كل ما تستنتجه الخوارزمية صحيح فعلاً | خاصية لازمة لأي inference procedure |
| `Complete` | تجد كل النتائج المستلزَمة فعلاً | خاصية مرغوبة لكن ليست دائماً متوفرة |
| `Horn Clause` | رمز مفرد، أو اقتران رموز ⇒ رمز | `C∧(B⇒A)` |
| `CNF` | اقتران من جمل-أو (clauses) | `(A∨¬B)∧(B∨¬C)` |
| `Literal` | رمز أو نفيه | `P`, `¬P` |
| `Valid (Tautology)` | صحيحة بكل نموذج | `A∨¬A` |
| `Unsatisfiable` | خاطئة بكل نموذج | `A∧¬A` |

### المكونات الرئيسية (مرجع سريع)
| الأداة | الوظيفة | ملاحظة |
| --- | --- | --- |
| `Inference Engine` | خوارزميات عامة مستقلة عن المجال | `domain-independent` |
| `Knowledge Base` | محتوى خاص بالمجال | `domain-specific` |
| `Modus Ponens` | استنتاج من مقدمات وقاعدة implication | يعمل على Horn Form فقط |
| `Resolution Rule` | حذف literals متناقضة ودمج clauses | يعمل على CNF، كامل للمنطق القضوي |

### جداول مقارنات سريعة
| المقارنة | الأول | الثاني | الفرق |
| --- | --- | --- | --- |
| Forward vs Backward Chaining | `data-driven`، يبدأ من الحقائق | `goal-driven`، يبدأ من الهدف | الاتجاه واستخدام الموارد |
| Model Checking vs Resolution | تعداد أسّي لكل النماذج | استدلال جبري خطوة بخطوة | الأداء والكفاءة |
| Horn Form vs CNF العام | استدلال خطي O(n) | استدلال أسّي O(2ⁿ) عموماً | التعبيرية مقابل السرعة |
| ⇒ vs ⇔ | اتجاه واحد | اتجاهين | الاستخدام بقواعد Wumpus |

### قاموس المصطلحات
| الفئة | المصطلحات |
| --- | --- |
| بيئة الوكيل | `PEAS`, `Observable`, `Deterministic`, `Episodic`, `Static`, `Discrete`, `Single-agent` |
| منطق أساسي | `Syntax`, `Semantics`, `Model`, `Entailment` |
| روابط منطقية | `¬`, `∧`, `∨`, `⇒`, `⇔` |
| استدلال | `Sound`, `Complete`, `Forward Chaining`, `Backward Chaining`, `Resolution`, `CNF`, `Horn Clause` |

### أبرز النقاط الذهبية
1. `KB ⊨ α` هي علاقة رياضية موجودة سلفاً؛ `Inference` هي محاولتنا لاكتشافها آلياً.
2. `KB ⊨ α ⟺ M(KB) ⊆ M(α)` — أساس Model Checking.
3. `KB ⊨ α ⟺ (KB∧¬α) unsatisfiable` — أساس Resolution (البرهان بالتناقض).
4. `Horn Form` يسمح باستدلال خطي (Forward/Backward Chaining)، لكنه أقل تعبيراً من CNF العام.
5. `Resolution` هي القاعدة الوحيدة الكاملة (sound + complete) لكل المنطق القضوي بدون قيود.
6. `Wumpus World`: `Partially Observable + Sequential` هي أهم سببين لحاجتنا لوكيل يبني معرفة تراكمية.

### الأخطاء الشائعة عند الطلاب ⚠️
| الخطأ | التصحيح |
| --- | --- |
| الخلط بين `⊨` (استلزام رياضي) و `⊢` (استنتاج بخوارزمية) | `⊨` علاقة موجودة أصلاً، `⊢ᵢ` محاولة اكتشافها بخوارزمية i |
| اعتبار `P⇒Q` خاطئة تلقائياً إذا P خاطئة | `P⇒Q` تكون **صحيحة** تلقائياً إذا P خاطئة (vacuous truth) |
| تطبيق Modus Ponens على جمل ليست Horn Form | Modus Ponens الأساسي محصور بـ Horn Clauses فقط |
| نسيان تحويل ⇔ قبل ⇒ عند بناء CNF | الترتيب: ⇔ أولاً، ثم ⇒، ثم النفي، ثم التوزيع |
| اعتبار Forward Chaining دائماً أسرع | Backward Chaining أحياناً أسرع بكثير لأنه goal-driven |

---

### خطوات وإجراءات المحاضرة

#### ⚙️ الخطوات / الخوارزمية: KB-Agent
> الحلقة العامة لأي وكيل قائم على معرفة.
```algorithm
1 | TELL | KB | إضافة جملة الإدراك الحالي
2 | ASK | KB | استعلام عن أفضل إجراء بالزمن الحالي
3 | TELL | KB | تسجيل الإجراء المتخذ
4 | تحديث | العدّاد t | الانتقال للزمن التالي
```
#### نقاط التنفيذ:
- الخوارزمية عامة (domain-independent)؛ التخصيص يكون بمحتوى KB فقط.

#### ⚙️ الخطوات / الخوارزمية: TT-Entails? (Model Checking)
> إثبات الاستلزام بتعداد كامل للنماذج.
```algorithm
1 | جمع | كل رموز KB و α | قائمة symbols
2 | فرع | لكل رمز | جرّب true ثم false عودياً
3 | فحص أساسي | عند اكتمال النموذج | تحقق KB صحيح؟ إذا نعم تحقق α
4 | إرجاع نتيجة | AND لكل الفروع | true فقط إذا نجحت كل الفروع
```
#### نقاط التنفيذ:
- تعقيد O(2ⁿ) — غير عملي لعدد رموز كبير.

#### ⚙️ الخطوات / الخوارزمية: PL-FC-ENTAILS? (Forward Chaining)
> استنتاج خطي بدءاً من الحقائق نحو الهدف.
```algorithm
1 | تهيئة | agenda, inferred, count | حسب الرموز المعروفة أصلاً
2 | سحب | POP(agenda) | رمز p
3 | فحص | for each rule with p in premise | decrement count[c]
4 | إطلاق | if count[c]=0 | استنتج HEAD[c] وأضفه لـ agenda
```
#### نقاط التنفيذ:
- خطي O(size of KB)، مناسب فقط لـ Horn Form.

#### ⚙️ الخطوات / الخوارزمية: Backward Chaining
> استنتاج بدءاً من الهدف نحو الحقائق.
```algorithm
1 | فحص | هل q معروفة أصلاً؟ | إذا نعم انتهى بنجاح
2 | بحث | عن قاعدة استنتاجها q | حدد مقدماتها
3 | استدعاء عودي | أثبت كل مقدمة بنفس الطريقة | تجنب التكرار والحلقات
4 | نجاح/فشل | تجميع نتائج المقدمات | إذا كلها نجحت، q مثبتة
```
#### نقاط التنفيذ:
- افحص `goal stack` لتجنب الحلقات اللانهائية.

#### ⚙️ الخطوات / الخوارزمية: PL-Resolution
> إثبات بالتناقض عبر CNF.
```algorithm
1 | تحويل | KB ∧ ¬α إلى CNF | مجموعة clauses
2 | فحص كل زوج | resolve(Ci, Cj) | استخرج literals متناقضة وادمج الباقي
3 | فحص تناقض | إذا نتج clause فارغة | أرجع true (α مثبتة)
4 | فحص استقرار | إذا لا جديد | أرجع false (α غير مستلزمة)
```
#### نقاط التنفيذ:
- الكفاءة تعتمد بشدة على استراتيجية اختيار الأزواج (خارج نطاق هذه المحاضرة).

---

### أنماط الأكواد والبنى المتكررة
| النمط | البنية الأساسية | متى تستخدمه |
| --- | --- | --- |
| `agenda + inferred[]` | قائمة انتظار + جدول حالة | Forward Chaining، تجنب إعادة المعالجة |
| `recursive backtracking` | استدعاء ذاتي مع فرعين (true/false) | Model Checking، Backward Chaining |
| `refutation proof` | افترض العكس ثم أثبت التناقض | Resolution، الاستلزام المنطقي |

### أنماط التعامل والسلوك
| السيناريو | التعامل الصحيح | لماذا؟ |
| --- | --- | --- |
| KB يحتوي فقط Horn Clauses | استخدم Forward أو Backward Chaining | أسرع (خطي) من Resolution |
| KB يحتوي جمل عامة (غير Horn) | استخدم Resolution بعد تحويل CNF | Resolution هي الوحيدة الكاملة هنا |
| مطلوب إثبات جملة محددة فقط | Backward Chaining | لا يبذّر وقت على استنتاجات غير ذات علاقة |
| مطلوب استنتاج كل المعارف الممكنة | Forward Chaining | يستكشف كل النتائج تلقائياً |

### الأفكار الرئيسية الشاملة
`Logical Agent` يجمع بين تمثيل معرفي رسمي (Propositional Logic) وخوارزميات استدلال (Model Checking، Chaining، Resolution) لبناء وكيل قادر على التصرف بأمان ببيئة جزئية الملاحظة مثل `Wumpus World` — وهذا يمهّد لـ `First-Order Logic` اللي بتوسّع القدرة التعبيرية أكثر.

---

## الجزء الثالث: أسئلة اختيار من متعدد (MCQ)

> **18 سؤالاً** — مستوى: medium/hard.

### السؤال 1 (medium)
ما هي القيمة الصحيحة لـ `Observable` في `Wumpus World`؟
أ) Yes، لأن الوكيل يرى كل الخريطة
ب) No، لأن الإدراك محلي فقط (المربع الحالي)
ج) Yes، لأنه بيئة deterministic
د) لا ينطبق على هذه البيئة
**الإجابة الصحيحة: ب**
**التعليل:** النص يذكر صراحة "Observable?? No—only local perception". (أ) خاطئ لأن الوكيل لا يرى الخريطة كاملة. (ج) خاطئ لأن `Deterministic` معيار مختلف تماماً عن `Observable`. (د) خاطئ لأن المعيار ينطبق دوماً على أي بيئة.

---

### السؤال 2 (medium)
لماذا يعتبر `Wumpus World` بيئة `Episodic: No`؟
أ) لأن الوكيل يموت بسرعة
ب) لأن القرارات مترابطة بالتسلسل (sequential at level of actions)
ج) لأن فيها أكثر من وكيل
د) لأن البيئة تتغير مع الزمن (dynamic)
**الإجابة الصحيحة: ب**
**التعليل:** النص يقول "Episodic?? No—sequential at the level of actions" — قرار كل خطوة يعتمد على التاريخ السابق. (أ) غير متعلق بالتعريف. (ج) هذا معيار `Single-agent` وليس `Episodic`. (د) البيئة `Static` وليست dynamic حسب النص.

---

### السؤال 3 (easy-medium)
ما الفرق الجوهري بين `Syntax` و `Semantics`؟
أ) لا يوجد فرق، مترادفان
ب) Syntax يحدد شكل الجملة الصحيح، Semantics يحدد معناها/صحتها
ج) Semantics يحدد شكل الجملة، Syntax يحدد معناها
د) كلاهما يتعلق فقط بالمنطق القضوي
**الإجابة الصحيحة: ب**
**التعليل:** حسب التعريف: "Syntax defines the sentences... Semantics define the meaning... truth of a sentence in a world". (ج) معكوس الصحيح. (أ)، (د) خاطئان لأن المفهومين عامّان لكل المنطق وليسا مترادفين.

---

### السؤال 4 (hard)
إذا كان `KB = {A, B}` و `α = A∨B`، فأي عبارة صحيحة؟
أ) `KB ⊭ α` لأن α غير مذكورة صراحة في KB
ب) `KB ⊨ α` لأن α صحيحة بكل نموذج يحقق KB
ج) لا يمكن تحديد العلاقة بدون model checking فعلي
د) `α ⊨ KB` وليس العكس
**الإجابة الصحيحة: ب**
**التعليل:** أي نموذج تكون فيه A و B صحيحتين، حتماً `A∨B` صحيحة أيضاً — هذا مطابق تماماً لمثال "the Giants won" و"the Reds won" بالمحاضرة. (أ) خاطئ لأن الاستلزام لا يتطلب الذكر الصريح. (ج) خاطئ لأن هذا استلزام بسيط واضح بدون حاجة لتعداد. (د) معكوس؛ لا يلزم أن يتحقق العكس.

---

### السؤال 5 (medium)
ما معنى `M(α) ⊆ M(KB)`... هل هذا هو تعريف `KB ⊨ α` الصحيح؟
أ) نعم، هذا هو التعريف الصحيح
ب) لا، التعريف الصحيح هو `M(KB) ⊆ M(α)`
ج) التعريفان متكافئان دائماً
د) لا علاقة للمجموعات بالاستلزام
**الإجابة الصحيحة: ب**
**التعليل:** النص يقول "KB ⊨ α iff M(KB) ⊆ M(α)" — أي كل عالم يحقق KB يجب أن يحقق α (وليس العكس). الخيار (أ) معكوس تماماً، (ج) خاطئ لأن الاتجاه مهم جداً، (د) يتناقض مع تعريف المحاضرة الأساسي عن Models.

---

### السؤال 6 (hard)
بمثال `Entailment in Wumpus World` (شريحة 25-30)، لماذا `KB ⊭ α₂` حيث `α₂ = "[2,2] is safe"`؟
أ) لأن [2,2] بعيد جداً عن الوكيل
ب) لأن يوجد على الأقل نموذج ضمن M(KB) يكون فيه [2,2] pit
ج) لأن الوكيل لم يزر [2,2] بعد
د) لأن الحساب الاحتمالي يثبت استحالة ذلك
**الإجابة الصحيحة: ب**
**التعليل:** حسب المخططات، من ضمن نماذج KB الممكنة (بعد استبعاد المتناقضة مع الملاحظات) يوجد نموذج واحد على الأقل فيه pit بـ[2,2]، لذلك لا يمكن ضمان الأمان بكل النماذج. (أ)، (ج) غير متعلقين بالتعريف المنطقي للاستلزام. (د) الاحتمال يوضح فقط أن هناك خطراً وليس دليلاً على استحالة الأمان بحد ذاته.

---

### السؤال 7 (medium)
أي عبارة تصف بدقة خاصية `Sound` لخوارزمية استدلال i؟
أ) تجد كل الاستنتاجات الصحيحة الممكنة
ب) كل ما تستنتجه صحيح فعلاً (مستلزم فعلاً من KB)
ج) تعمل بزمن خطي دائماً
د) لا تتوقف أبداً
**الإجابة الصحيحة: ب**
**التعليل:** حسب التعريف "Soundness: whenever KB ⊢ᵢ α, it is also true that KB ⊨ α". (أ) هذا تعريف `Complete` وليس `Sound`. (ج)، (د) غير متعلقين بالتعريف إطلاقاً.

---

### السؤال 8 (medium)
أي من التالي مثال صحيح على `Horn Clause`؟
أ) `A ∨ B`
ب) `¬A ∨ ¬B ∨ C` (بدون تحويل)
ج) `C ∧ D ⇒ B`
د) `A ⇔ B`
**الإجابة الصحيحة: ج**
**التعليل:** التعريف: "Horn clause = proposition symbol; or (conjunction of symbols) ⇒ symbol" — الخيار (ج) اقتران رموز يستلزم رمز واحد، مطابق تماماً. (أ) جملة-أو بسيطة بدون implication محددة النتيجة (ليست Horn ما لم يكن أحد الطرفين نفي الآخر بشكل خاص). (ب) تحتوي أكثر من literal موجب محتمل، ليست بصيغة implication قياسية بسيطة لرمز واحد فقط ضمن هذا التعريف المبسط. (د) biconditional وليست Horn Clause.

---

### السؤال 9 (hard)
بمثال `Forward Chaining` (KB = {P⇒Q, L∧M⇒P, B∧L⇒M, A∧P⇒L, A∧B⇒L, A, B})، ما أول رمز جديد يُستنتج بعد A و B؟
أ) Q
ب) P
ج) L (عبر القاعدة A∧B⇒L)
د) M
**الإجابة الصحيحة: ج**
**التعليل:** بعد معرفة A و B، القاعدة `A∧B⇒L` هي الوحيدة التي يكتمل عدّاد مقدماتها لصفر أولاً (لأن A∧P⇒L تحتاج P غير معروفة بعد). (أ)، (ب)، (د) تحتاج جميعها استنتاج L أولاً كخطوة سابقة لها.

---

### السؤال 10 (hard)
بنفس مثال Forward Chaining، ما ترتيب الاستنتاج الصحيح للرموز بعد A، B؟
أ) L, M, P, Q
ب) M, L, Q, P
ج) P, L, M, Q
د) L, P, M, Q
**الإجابة الصحيحة: أ**
**التعليل:** كما بالتتبع بالجزء الأول: L (من A∧B) ← M (من B∧L) ← P (من L∧M) ← Q (من P). (ب)، (ج)، (د) تخالف ترتيب اعتماد كل قاعدة على مقدماتها.

---

### السؤال 11 (medium)
لماذا Backward Chaining غالباً أسرع من Forward Chaining بمسائل محددة الهدف؟
أ) لأنه يستخدم خوارزمية مختلفة جوهرياً عن Modus Ponens
ب) لأنه goal-driven ولا يستكشف معلومات غير ذات علاقة بالهدف
ج) لأنه لا يحتاج KB أصلاً
د) لأنه دائماً أسرع بكل الحالات بدون استثناء
**الإجابة الصحيحة: ب**
**التعليل:** النص: "BC is goal-driven, appropriate for problem-solving... Complexity of BC can be much less than linear in size of KB". (أ) كلاهما يستخدم Modus Ponens لكن باتجاه مختلف. (ج) خاطئ، ما زال يحتاج KB. (د) مبالغة غير دقيقة — "can be" وليس "always".

---

### السؤال 12 (medium)
ما الشرط الأساسي لتطبيق `Resolution`؟
أ) أن تكون الجمل بصيغة Horn Form فقط
ب) أن تكون الجمل بصيغة CNF
ج) أن يكون KB يحتوي فقط implications
د) لا يوجد شرط مسبق
**الإجابة الصحيحة: ب**
**التعليل:** النص: "Resolution inference rule (for CNF)". (أ) هذا شرط Modus Ponens وليس Resolution. (ج) غير دقيق، الجمل يمكن أن تحتوي أي تركيب بعد تحويله لـ CNF. (د) خاطئ، CNF شرط أساسي.

---

### السؤال 13 (hard)
عند تحويل `B1,1 ⇔ (P1,2∨P2,1)` إلى CNF، ما الخطوة الأولى الصحيحة؟
أ) نقل النفي للداخل مباشرة
ب) استبدال ⇔ بـ `(B1,1⇒(P1,2∨P2,1)) ∧ ((P1,2∨P2,1)⇒B1,1)`
ج) تطبيق قانون De Morgan مباشرة
د) تطبيق التوزيع مباشرة
**الإجابة الصحيحة: ب**
**التعليل:** الترتيب الإلزامي المذكور بالنص: "1. Eliminate ⇔... 2. Eliminate ⇒... 3. Move ¬ inwards... 4. Apply distributivity". لا يمكن تخطي الخطوة الأولى. باقي الخيارات (أ، ج، د) خطوات لاحقة وليست أولى.

---

### السؤال 14 (hard)
بمسألة Resolution مثال شريحة 71، ما هو الـ literal الذي أدى للوصول للجملة الفارغة (تناقض)؟
أ) `B1,1` و `¬B1,1`
ب) `P1,2` و `¬P1,2`
ج) `P2,1` و `¬P2,1`
د) لا يوجد تناقض بهذا المثال
**الإجابة الصحيحة: ب**
**التعليل:** آخر خطوة بالمثال هي resolve بين `¬P1,2` (الناتجة من خطوات سابقة) و`P1,2` (من نفي الهدف `¬α`)، فينتج الجملة الفارغة. (أ)، (ج) استُخدما بخطوات وسيطة لكن التناقض النهائي حدث على P1,2. (د) خاطئ، النص يؤكد وصول التناقض.

---

### السؤال 15 (medium)
ما معنى وصول خوارزمية `PL-Resolution` للجملة الفارغة (`empty clause`)؟
أ) أن KB غير متسقة أصلاً بغض النظر عن α
ب) أن `KB ∧ ¬α` غير قابلة للتحقق (unsatisfiable)، وبالتالي `KB ⊨ α`
ج) أن الخوارزمية فشلت بالإثبات
د) أن يجب إعادة تحويل KB لـ CNF من جديد
**الإجابة الصحيحة: ب**
**التعليل:** هذا جوهر "reductio ad absurdum": الوصول لتناقض (empty clause) يعني أن الافتراض (`¬α` مع KB) مستحيل، وبالتالي α يجب أن تكون صحيحة. (أ) استنتاج غير دقيق دون سياق. (ج) عكس الصحيح تماماً. (د) لا داعي لإعادة التحويل.

---

### السؤال 16 (medium)
ما تعقيد خوارزمية `TT-Entails?` بدلالة عدد الرموز n؟
أ) O(n)
ب) O(n log n)
ج) O(2ⁿ)
د) O(n²)
**الإجابة الصحيحة: ج**
**التعليل:** النص يذكر صراحة "O(2ⁿ) for n symbols; problem is co-NP-complete" — لأنها تعدّد كل التوليفات الممكنة. باقي الخيارات لا تعكس طبيعة التعداد الشامل (exhaustive enumeration).

---

### السؤال 17 (hard)
في `Backward Chaining`، ما الهدف من فحص `goal stack` عند إضافة هدف فرعي جديد؟
أ) لتسريع البحث فقط دون علاقة بالصحة
ب) لتجنب الدخول بحلقة لا نهائية (loop) بسبب اعتماد دائري
ج) لتحويل الخوارزمية لـ Forward Chaining
د) لا داعي لهذا الفحص، هو اختياري بالكامل
**الإجابة الصحيحة: ب**
**التعليل:** النص: "Avoid loops: check if new subgoal is already on the goal stack" — هذا فحص ضروري وليس اختيارياً لتفادي حلقة تكرار بلا نهاية عند اعتماديات دائرية بين القواعد. (أ) جزئياً صحيح كنتيجة جانبية لكن الهدف الأساسي هو الصحة/الإنهاء وليس السرعة فقط. (ج)، (د) غير صحيحين.

---

### السؤال 18 (hard)
أي سيناريو (Wumpus World) يستدعي استخدام استراتيجية `coercion` (الإكراه، مثل إطلاق السهم للأمام)؟
أ) عندما يكون الوكيل واثقاً 100% من وجود Pit بمربع مجاور
ب) عندما تكون كل الخيارات المتاحة غير آمنة منطقياً (مثل Smell في [1,1] يمنع الحركة)
ج) عندما يجد الوكيل الذهب مباشرة
د) عندما يكون عدد الأسهم أكثر من واحد
**الإجابة الصحيحة: ب**
**التعليل:** النص: "Smell in (1,1) ⇒ cannot move. Can use a strategy of coercion: shoot straight ahead — wumpus was there ⇒ dead ⇒ safe; wumpus wasn't there ⇒ safe". (أ) لو واثق 100% من Pit فالحل تجنّب المربع وليس الإطلاق (السهم يقتل Wumpus لا Pit). (ج) لا علاقة بالإكراه. (د) الوكيل يملك سهماً واحداً فقط حسب PEAS ("shooting uses the only arrow").

---

## الجزء الرابع: أسئلة تصحيح الخوارزميات (Pseudocode)

### سؤال تصحيح 1 — logic

**الكود التالي يحتوي خطأ:**
```text
function TT-CHECK-ALL(KB, alpha, symbols, model) returns true or false
    if EMPTY?(symbols) then
        if PL-TRUE?(KB, model) then return PL-TRUE?(alpha, model)
        else return false          // (خطأ هنا)
    else do
        P <- FIRST(symbols); rest <- REST(symbols)
        return TT-CHECK-ALL(KB, alpha, rest, EXTEND(P, true, model)) and
               TT-CHECK-ALL(KB, alpha, rest, EXTEND(P, false, model))
```
**اكتشف الخطأ:** عندما يكون KB خاطئاً بالنموذج الحالي، الكود يرجّع `false` بدلاً من `true` — وهذا يخالف تعريف الاستلزام الذي يهتم فقط بالنماذج التي يكون فيها KB صحيحاً؛ إرجاع `false` هنا سيجعل الدالة تفشل خطأً حتى لو كان الاستلزام صحيحاً فعلياً.

**التصحيح:**
```text
        if PL-TRUE?(KB, model) then return PL-TRUE?(alpha, model)
        else return true            // النماذج التي KB خاطئ فيها لا تؤثر على الاستلزام
```
**شرح الحل:**
1. `KB ⊨ α` يعني α صحيحة فقط بالنماذج التي KB فيها صحيح.
2. النماذج التي KB خاطئ فيها "غير ذات علاقة" ويجب تجاهلها (إرجاع true بمعنى "لا مشكلة هنا").
3. إرجاع false خطأً بهذه الحالة سيجعل `and` بالمستوى الأعلى يفشل دوماً حتى مع استلزام صحيح فعلياً.

---

### سؤال تصحيح 2 — misconception

**الكود التالي يحتوي خطأ:**
```text
function PL-FC-ENTAILS?(KB, q) returns true or false
    inferred[p] <- false for all p
    agenda <- symbols known in KB
    while agenda is not empty do
        p <- POP(agenda)
        inferred[p] <- true
        for each Horn clause c in whose premise p appears do
            if HEAD[c] = q then return true      // (خطأ هنا)
            PUSH(HEAD[c], agenda)
    return false
```
**اكتشف الخطأ:** الكود يتحقق من الهدف q فوراً بمجرد وجود p بمقدمة القاعدة، **دون التأكد من أن كل مقدمات القاعدة أصبحت معروفة** (لا يستخدم `count[c]`). هذا يعني أن القاعدة ممكن "تُطلق" قبل اكتمال شروطها فعلياً — خطأ منطقي جسيم (سوء فهم لمبدأ Horn Clause).

**التصحيح:**
```text
function PL-FC-ENTAILS?(KB, q) returns true or false
    count[c] <- number of premises for each clause c
    inferred[p] <- false for all p
    agenda <- symbols known in KB
    while agenda is not empty do
        p <- POP(agenda)
        unless inferred[p] do
            inferred[p] <- true
            for each Horn clause c in whose premise p appears do
                decrement count[c]
                if count[c] = 0 then
                    if HEAD[c] = q then return true
                    PUSH(HEAD[c], agenda)
    return false
```
**شرح الحل:**
1. يجب أن تكتمل **كل** مقدمات القاعدة (`count[c]=0`) قبل اعتبار استنتاجها معروفاً.
2. إضافة فحص `unless inferred[p]` يمنع إعادة معالجة الرمز نفسه أكثر من مرة (كفاءة وصحة).
3. بدون `count[c]`، القاعدة `A∧B⇒L` ممكن "تُطلق" بمجرد معرفة A فقط، وهذا استنتاج خاطئ منطقياً.

---

### سؤال تصحيح 3 — infinite_loop

**الكود التالي يحتوي خطأ:**
```text
function BACKWARD-CHAIN(KB, goal) returns true or false
    if goal is known then return true
    for each rule r with HEAD[r] = goal do
        if all premises of r proved by BACKWARD-CHAIN(KB, premise) then
            return true
    return false
    // لا يوجد فحص لـ goal stack
```
**اكتشف الخطأ:** الكود لا يفحص إذا كان `goal` الحالي موجوداً أصلاً بمكدس الأهداف الجاري إثباتها (`goal stack`)، مما يسبب حلقة لا نهائية إذا كانت هناك قواعد دائرية (مثلاً `X⇒Y` و`Y⇒X` بدون معرفة أساسية).

**التصحيح:**
```text
function BACKWARD-CHAIN(KB, goal, goal_stack) returns true or false
    if goal is known then return true
    if goal in goal_stack then return false        // تجنب الحلقة
    push goal onto goal_stack
    for each rule r with HEAD[r] = goal do
        if all premises of r proved by BACKWARD-CHAIN(KB, premise, goal_stack) then
            pop goal_stack; return true
    pop goal_stack
    return false
```
**شرح الحل:**
1. `goal_stack` يتتبع كل الأهداف الجاري إثباتها حالياً بنفس السلسلة العودية.
2. إذا ظهر نفس الهدف مرة ثانية بنفس السلسلة، هذا دليل دائرية — يجب إيقاف المحاولة (`return false`) بدل التكرار للأبد.
3. هذا يطابق النص: "Avoid loops: check if new subgoal is already on the goal stack".

---

### سؤال تصحيح 4 — logic

**الكود التالي يحتوي خطأ:**
```text
function PL-RESOLUTION(KB, alpha) returns true or false
    clauses <- CNF representation of KB and alpha    // (خطأ هنا)
    new <- {}
    loop do
        for each Ci, Cj in clauses do
            resolvents <- PL-RESOLVE(Ci, Cj)
            if resolvents contains the empty clause then return true
            new <- new union resolvents
        if new subset-of clauses then return false
        clauses <- clauses union new
```
**اكتشف الخطأ:** السطر الأول يحوّل `KB و alpha` مباشرة (بدون نفي)، بينما مبدأ Resolution يعتمد على **البرهان بالتناقض** — يجب نفي `alpha` أولاً (`¬alpha`) وليس استخدامها كما هي.

**التصحيح:**
```text
    clauses <- CNF representation of KB and NOT-alpha   // نفي الهدف
```
**شرح الحل:**
1. `KB ⊨ α` تُثبت عبر إظهار أن `KB ∧ ¬α` غير قابلة للتحقق (unsatisfiable).
2. استخدام `α` بدون نفي يحوّل الخوارزمية لإثبات شيء مختلف تماماً (اتساق KB مع α، وليس استلزامها).
3. هذا مطابق للنص: "clauses <- the set of clauses in the CNF representation of KB ∧ ¬α".

---

### سؤال تصحيح 5 — wrong_heuristic

**الكود التالي يحتوي خطأ:**
```text
// اختيار المربع التالي للحركة في Wumpus World
function CHOOSE-NEXT-SQUARE(squares) returns a square
    for each square s in squares do
        if s has Breeze then
            return s              // (خطأ هنا - اختيار خاطئ)
    return random square
```
**اكتشف الخطأ:** الكود يختار المربع الذي **فيه** `Breeze` كخطوة تالية — هذا معكوس تماماً؛ `Breeze` مؤشر خطر محتمل (وجود Pit مجاور)، فيجب **تجنّب** هذه المربعات وليس اختيارها.

**التصحيح:**
```text
function CHOOSE-NEXT-SQUARE(squares) returns a square
    for each square s in squares do
        if s is marked OK (proven safe, no Breeze/Smell risk) then
            return s
    return null   // لا يوجد خيار آمن مؤكد، استخدم استراتيجية بديلة (احتمال أو coercion)
```
**شرح الحل:**
1. حسب النص، `Breeze` علامة تحذير من احتمال وجود `Pit` مجاور — ليست إشارة أمان.
2. يجب اختيار المربعات المؤكد أمانها منطقياً (`OK`) أولاً دائماً.
3. عند عدم توفر خيار آمن، تُستخدم استراتيجيات بديلة (احتمالية أو coercion) كما ورد بشريحة "Other tight spots".

---

### سؤال تصحيح 6 — logic

**الكود التالي يحتوي خطأ:**
```text
// بناء قاعدة Breeze لمربع [1,1]
R2: B1,1 => (P1,2 v P2,1)     // (خطأ هنا - اتجاه واحد فقط)
```
**اكتشف الخطأ:** استخدام `⇒` بدل `⇔` يجعل القاعدة تنص فقط على "إذا كان في Breeze فلازم Pit مجاور" لكنها **لا تسمح بالاستنتاج العكسي**: "إذا لم يوجد Breeze فلا يوجد Pit مجاور" — وهذا استنتاج أساسي يحتاجه الوكيل لإثبات الأمان (كما بمثال [1,2] safe).

**التصحيح:**
```text
R2: B1,1 <=> (P1,2 v P2,1)
```
**شرح الحل:**
1. النص الأصلي يستخدم `⇔` صراحة: "B1,1 ⇔ (P1,2∨P2,1)".
2. الاتجاه العكسي ضروري: عدم وجود Breeze (`¬B1,1`) يجب أن يستلزم عدم وجود Pit مجاور (`¬P1,2 ∧ ¬P2,1`) — وهذا بالضبط أساس إثبات أن [1,2] آمن بمثال Model Checking.
3. بدون `⇔`، الوكيل لن يستطيع أبداً إثبات أمان أي مربع، فقط اكتشاف الخطر.

---

## الجزء الرابع: تمارين تطبيقية (من إعداد الدليل للتدريب)

> **هذه تمارين إضافية من إعداد الدليل** — ليست في المحاضرة الأصلية.

### تمرين 1: تحديد نوع البيئة — fill_gaps

**السيناريو / المطلوب:**
بيئة لعبة شطرنج بين لاعبين، كل لاعب يرى كل الرقعة بالكامل.

**المطلوب:**
1. حدد قيم: Observable, Deterministic, Episodic, Static, Discrete, Single-agent.

**نموذج الحل:**
| المعيار | القيمة | السبب |
| --- | --- | --- |
| Observable | Yes | الرقعة مرئية بالكامل لكلا اللاعبين |
| Deterministic | Yes (بدون نرد) | لا عشوائية بقواعد الشطرنج |
| Episodic | No | كل نقلة تعتمد على تاريخ اللعبة |
| Static | No | الخصم يحرّك القطع أثناء تفكيرك |
| Discrete | Yes | عدد محدود من المربعات والقطع |
| Single-agent | No | يوجد لاعب خصم بأهداف متعارضة |

---

### تمرين 2: بناء جملة CNF — code_fix

**السيناريو / المطلوب:**
لديك الجملة `A ⇒ (B ∧ C)`.

**المطلوب:**
1. حوّلها لصيغة CNF كاملة باتباع الخطوات الأربع.

**نموذج الحل:**
```text
الأصل: A ⇒ (B ∧ C)
خطوة 2 (إزالة ⇒): ¬A ∨ (B ∧ C)
خطوة 4 (توزيع ∨ على ∧): (¬A ∨ B) ∧ (¬A ∨ C)
```
النتيجة النهائية: `(¬A∨B) ∧ (¬A∨C)` — clause لكل جزء من الاقتران الأصلي.

---

### تمرين 3: Model Checking يدوي — logic_table

**السيناريو / المطلوب:**
KB = `{P, P⇒Q}`، أثبت أو انفِ `KB ⊨ Q` عبر جدول حقيقة.

**المطلوب:**
1. عدّد كل النماذج الممكنة لـ P و Q.
2. حدد النماذج التي تحقق KB.
3. تحقق من Q بتلك النماذج.

**نموذج الحل:**
| P | Q | P (صح؟) | P⇒Q (صح؟) | KB صحيح؟ | Q صحيح؟ |
| --- | --- | --- | --- | --- | --- |
| false | false | false | true | false | - |
| false | true | false | true | false | - |
| true | false | true | false | false | - |
| true | true | true | true | **true** | true |

**النتيجة:** النموذج الوحيد الذي KB فيه صحيح هو `P=true, Q=true` وفيه Q صحيحة أيضاً → **`KB ⊨ Q`**.

---

### تمرين 4: تتبع Forward Chaining — search_trace

**السيناريو / المطلوب:**
KB = { X⇒Y, Y∧Z⇒W, X, Z }، الهدف: أثبت W.

**المطلوب:**
1. طبّق Forward Chaining خطوة بخطوة حتى تصل إلى W أو تتأكد من استحالة الوصول.

**نموذج الحل:**
| الخطوة | الرمز المعالَج | الاستنتاج الجديد |
| --- | --- | --- |
| 1 | X | count[X⇒Y]→0 → Y مستنتجة |
| 2 | Z | count[Y∧Z⇒W]→1 (بانتظار Y) |
| 3 | Y | count[Y∧Z⇒W]→0 → **W مستنتجة!** |

**النتيجة:** `KB ⊢ W` بنجاح.

---

### تمرين 5: تطبيق Resolution يدوياً — logic_table

**السيناريو / المطلوب:**
لديك clauses: `{A∨B, ¬B∨C, ¬A}`. أثبت هل `KB ⊨ C`؟

**المطلوب:**
1. أضف `¬C` (نفي الهدف) لمجموعة clauses.
2. طبّق Resolution خطوة بخطوة حتى تصل لجملة فارغة أو نقطة ثابتة.

**نموذج الحل:**
| الخطوة | العملية | الناتج |
| --- | --- | --- |
| 1 | ابدأ بـ {A∨B, ¬B∨C, ¬A, ¬C} | - |
| 2 | resolve(A∨B, ¬A) | B |
| 3 | resolve(B, ¬B∨C) | C |
| 4 | resolve(C, ¬C) | **الجملة الفارغة {}** |

**النتيجة:** تناقض → `KB ⊨ C` مثبتة.

---

### تمرين 6: مقارنة Sound/Complete — scenario

**السيناريو / المطلوب:**
خوارزمية X تستنتج فقط جملاً صحيحة فعلاً لكنها أحياناً تفشل بإيجاد استنتاجات صحيحة موجودة.

**المطلوب:**
1. هل هذه الخوارزمية `Sound`؟ هل هي `Complete`؟ علّل.

**نموذج الحل:**
- **Sound:** نعم — كل ما تستنتجه صحيح فعلاً (`KB ⊢ᵢ α ⟹ KB ⊨ α`).
- **Complete:** لا — لا تجد كل النتائج المستلزَمة الموجودة فعلياً (`KB ⊨ α` لا يعني بالضرورة `KB ⊢ᵢ α` بهذه الخوارزمية).
- مثال على هذا النمط: `Backward Chaining` على KB غير Horn Form ممكن يفوّت استنتاجات صحيحة.

---

### تمرين 7: بناء Wumpus KB — scenario

**السيناريو / المطلوب:**
مربع [3,1] فيه Breeze، ولا يوجد Breeze بـ[2,1] ولا [4,1] (المربعان المجاوران الوحيدان معروفان).

**المطلوب:**
1. اكتب القاعدة المنطقية لـ B3,1.
2. ماذا يمكن استنتاجه عن P2,1 و P4,1 و P3,2؟

**نموذج الحل:**
- القاعدة: `B3,1 ⇔ (P2,1 ∨ P4,1 ∨ P3,2)`
- بما أن `B3,1 = true`، إذاً `(P2,1 ∨ P4,1 ∨ P3,2) = true` — يوجد Pit في واحد على الأقل من الثلاثة (لا يمكن تحديد أيهم بدون معلومات إضافية).

---

## الجزء الرابع: تمارين تحليل وتطبيق (إضافية — من إعداد الدليل)

> تمارين تحليلية إضافية — جداول ناقصة، إكمال أشجار بحث، تطبيق Resolution.

### تمرين 1: إكمال جدول Truth Table Inference

**السيناريو:**
KB يحتوي `¬P1,1`, `¬B1,1`, `B2,1` والقاعدتين R2, R3 من المحاضرة، مع 5 رموز Boolean (B1,1, B2,1, P1,1, P1,2, P2,1, P2,2, P3,1).

**المطلوب:**
1. أكمل جدول الحقيقة الجزئي التالي (اختر 3 صفوف فقط للتوضيح) وحدد أي الصفوف تجعل KB صحيحاً.

| B1,1 | B2,1 | P1,1 | P1,2 | P2,1 | P2,2 | P3,1 | R1 | R2 | R3 | R4 | R5 | KB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| false | true | false | false | false | true | false | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| false | true | false | false | false | false | true | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |

**نموذج الحل:**
| B1,1 | B2,1 | P1,1 | P1,2 | P2,1 | P2,2 | P3,1 | R1 | R2 | R3 | R4 | R5 | KB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| false | true | false | false | false | true | false | true | true | true | true | true | **true** |
| false | true | false | false | false | false | true | true | true | true | true | true | **true** |

هذان الصفان (وصف ثالث أيضاً P2,2∧P3,1) هما ضمن الصفوف الصحيحة الثلاث المذكورة بالمحاضرة (شريحة 38).

---

### تمرين 2: إكمال شجرة Resolution

**السيناريو:**
KB = `(B1,1 ⇔ (P1,2∨P2,1)) ∧ ¬B1,1`, الهدف α = `¬P1,2`.

**المطلوب:**
1. أكمل تسلسل خطوات Resolution الناقص التالي:

```text
البداية: {¬P2,1∨B1,1, ¬B1,1∨P1,2∨P2,1, ¬P1,2∨B1,1, ¬B1,1, P1,2}
خطوة 1: resolve(¬P1,2∨B1,1, ¬B1,1) => ؟
خطوة 2: resolve(؟, P1,2) => ؟
```

**نموذج الحل:**
```text
خطوة 1: resolve(¬P1,2∨B1,1, ¬B1,1) => ¬P1,2
خطوة 2: resolve(¬P1,2, P1,2) => {} (الجملة الفارغة)
```
**النتيجة:** تناقض تم الوصول إليه → `KB ⊨ ¬P1,2` مثبتة.

---

### تمرين 3: heuristic_eval بسيط — تقييم قرار الوكيل

**السيناريو:**
الوكيل بمربع [2,1] بعد أن اكتشف Breeze، وأمامه خياران: التقدم لـ[2,2] (احتمال Pit=0.86) أو [3,1] (احتمال Pit=0.31) حسب المحاضرة.

**المطلوب:**
1. أي خيار يجب أن يختار الوكيل منطقياً وفق مبدأ تقليل المخاطر؟ علّل بالأرقام.

**نموذج الحل:**
يختار [3,1] لأن احتمال وجود Pit فيه (0.31) أقل بكثير من [2,2] (0.86) — رغم أن كلاهما غير مضمون الأمان منطقياً بشكل قاطع (`KB ⊭ safe` لكليهما)، القرار العقلاني هو تقليل احتمال الخسارة الفادحة (-1000 عند الموت).

---

### تمرين 4: written_analysis — لماذا Horn Form محدودة؟

**السيناريو:**
جملة `A ∨ B` (بدون implication) لا يمكن تمثيلها كـ Horn Clause واحدة.

**المطلوب:**
1. اشرح لماذا، وما البديل لو أردنا استخدامها بخوارزمية استدلال.

**نموذج الحل:**
`Horn Clause` تتطلب إما رمزاً مفرداً أو implication بنتيجة واحدة فقط (`conjunction ⇒ symbol`). الجملة `A∨B` تحتوي رمزين موجبين بدون implication محددة — لا يمكن كتابتها بهذا القالب. البديل: تحويلها لـ CNF عام (وهي أصلاً بصيغة CNF بسيطة: clause واحدة) واستخدام `Resolution` بدلاً من `Forward/Backward Chaining` المحصورين بـ Horn Form.

---

## الجزء الرابع: تمارين تتبع الخوارزميات (خطوة بخطوة)

### تمرين تتبع 1: TT-Entails? مبسّط

**المدخل:**
```text
KB = {A, A=>B}
alpha = B
symbols = [A, B]
```

**تتبّع خطوة بخطوة (أكمل الجدول):**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | جرّب A=true, B=true | ؟ |
| 2 | جرّب A=true, B=false | ؟ |
| 3 | جرّب A=false, B=true | ؟ |
| 4 | جرّب A=false, B=false | ؟ |

**نموذج الحل:**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | A=true, B=true | KB=true (A صحيح, A⇒B صحيح) → تحقق α: B=true ✓ |
| 2 | A=true, B=false | KB=false (A⇒B خاطئة) → تجاهل (لا يؤثر) |
| 3 | A=false, B=true | KB=false (A خاطئة) → تجاهل |
| 4 | A=false, B=false | KB=false (A خاطئة) → تجاهل |

**النتيجة:** كل النماذج التي KB صحيح فيها (فقط الخطوة 1) تجعل α صحيحة أيضاً → `KB ⊨ B`.

---

### تمرين تتبع 2: Forward Chaining مع agenda كامل

**المدخل:**
```text
KB = {M=>Q, N∧M=>P, N, M}
هدف: Q
```

**تتبّع خطوة بخطوة (أكمل الجدول):**
| الخطوة | agenda قبل | الرمز المعالَج | inferred بعد | agenda بعد |
| --- | --- | --- | --- | --- |
| 1 | [N, M] | ؟ | ؟ | ؟ |
| 2 | ؟ | ؟ | ؟ | ؟ |
| 3 | ؟ | ؟ | ؟ | ؟ |

**نموذج الحل:**
| الخطوة | agenda قبل | الرمز المعالَج | inferred بعد | agenda بعد |
| --- | --- | --- | --- | --- |
| 1 | [N, M] | N | {N} | [M] (count[N∧M⇒P] ينقص لـ1) |
| 2 | [M] | M | {N, M} | [P, Q] (count[N∧M⇒P]→0 استنتج P؛ count[M⇒Q]→0 استنتج Q) |
| 3 | [P, Q] | P (أو Q) | {N, M, P, Q} | Q موجودة ضمن agenda → توقف عند إيجادها = **true** |

**النتيجة:** `Q` مُثبتة، `KB ⊢ Q`.

---

### تمرين تتبع 3: Backward Chaining مع goal stack

**المدخل:**
```text
KB = {X=>Y, Y=>Z, X}
هدف: Z
```

**تتبّع خطوة بخطوة (أكمل الجدول):**
| الخطوة | الهدف الحالي | goal_stack | النتيجة |
| --- | --- | --- | --- |
| 1 | Z | [] | ؟ |
| 2 | Y | ؟ | ؟ |
| 3 | X | ؟ | ؟ |

**نموذج الحل:**
| الخطوة | الهدف الحالي | goal_stack | النتيجة |
| --- | --- | --- | --- |
| 1 | Z | [] → ادفع Z | ابحث عن قاعدة نتيجتها Z → Y⇒Z، هدف فرعي: Y |
| 2 | Y | [Z] → ادفع Y | ابحث عن قاعدة نتيجتها Y → X⇒Y، هدف فرعي: X |
| 3 | X | [Z, Y] → ادفع X | X معروفة أصلاً ✓ → ارجع true لكل المستويات |

**النتيجة:** `Z` مُثبتة عبر السلسلة `X ⟹ Y ⟹ Z`.

---

### تمرين تتبع 4: Resolution كامل

**المدخل:**
```text
clauses = {A∨¬B, B∨¬C, C}
هدف: A
```

**تتبّع خطوة بخطوة (أكمل الجدول):**
| الخطوة | العملية | الناتج |
| --- | --- | --- |
| 1 | أضف ¬A لمجموعة clauses | ؟ |
| 2 | resolve(B∨¬C, C) | ؟ |
| 3 | resolve(A∨¬B, ؟) | ؟ |
| 4 | resolve(؟, ¬A) | ؟ |

**نموذج الحل:**
| الخطوة | العملية | الناتج |
| --- | --- | --- |
| 1 | clauses = {A∨¬B, B∨¬C, C, ¬A} | - |
| 2 | resolve(B∨¬C, C) | B |
| 3 | resolve(A∨¬B, B) | A |
| 4 | resolve(A, ¬A) | **{} (الجملة الفارغة)** |

**النتيجة:** تناقض → `KB ⊨ A` مثبتة.

---

## الجزء الرابع: أسئلة تصميم

### سؤال تصميم 1: تصميم KB-Agent لـ Wumpus World

**المطلوب:**
صمّم مخطط تدفق (`activity diagram`) لدورة عمل وكيل Wumpus World الأساسية بدءاً من الإدراك وحتى اتخاذ القرار، مستخدماً TELL/ASK ومفهوم "المربعات الآمنة".

**نموذج الإجابة:**

#### 📊 المخطط: دورة عمل Wumpus Agent

#### ما هذا المخطط؟
> يوضح كيف يدمج الوكيل الإدراك الجديد بمعرفته، ويستنتج المربعات الآمنة، ويقرر الحركة.

#### وصف العُقد:
| # | العُقدة | النوع `kind` | الشرح |
| --- | --- | --- | --- |
| 1 | Perceive | event | استقبال Breeze/Smell/Glitter |
| 2 | TELL(KB, percept) | action | إضافة الإدراك كجملة منطقية |
| 3 | Infer safe squares | action | تطبيق Model Checking أو Resolution |
| 4 | ASK(KB, action) | decision | استعلام عن أفضل حركة |
| 5 | Act | action | تنفيذ الحركة/الإجراء |

#### وصف الروابط:
| من | إلى | التسمية | نوع السهم | الشرح |
| --- | --- | --- | --- | --- |
| Perceive | TELL | إدراك جديد | تدفق | كل خطوة زمنية |
| TELL | Infer | تحديث | تدفق | استنتاج معرفة جديدة |
| Infer | ASK | قرار | تدفق | استعلام مبني على الاستنتاج |
| ASK | Act | تنفيذ | تدفق | تحديث t والعودة للإدراك |

```diagram
type: activity
title: Wumpus Agent Cycle
direction: TD
nodes:
  - id: perceive
    label: Perceive (Breeze/Smell/Glitter)
    kind: event
    level: 0
  - id: tell
    label: TELL(KB, percept)
    kind: action
    level: 1
  - id: infer
    label: Infer safe squares
    kind: action
    level: 2
  - id: ask
    label: ASK(KB, action)
    kind: decision
    level: 3
  - id: act
    label: Act
    kind: action
    level: 4
edges:
  - from: perceive
    to: tell
  - from: tell
    to: infer
  - from: infer
    to: ask
  - from: ask
    to: act
  - from: act
    to: perceive
```

**معايير التقييم:**
- وضوح دورة TELL/ASK/Act المتكررة
- إظهار خطوة الاستدلال (Infer) كمرحلة منفصلة عن TELL/ASK
- توضيح العودة (loop) للإدراك بالخطوة التالية

---

### سؤال تصميم 2: تصميم نظام استدلال هجين

**المطلوب:**
صمّم بنية نظام يستخدم `Forward Chaining` لجزء من KB (قواعد Horn) و`Resolution` للجزء الآخر (قواعد عامة)، ووضّح متى يُستدعى كل منهما.

**نموذج الإجابة:**
```text
Architecture: Hybrid Inference System
1. Input: KB (mixed clauses)
2. Classifier: separate clauses into:
   - Horn_KB (all Horn clauses)
   - General_KB (non-Horn clauses, e.g., A∨B without implication)
3. Query handler:
   if query is a simple positive fact AND Horn_KB sufficient:
       use Forward/Backward Chaining on Horn_KB (fast, linear)
   else:
       convert (Horn_KB ∪ General_KB) to CNF
       apply Resolution (complete but slower)
4. Output: true/false (or derived facts)
```

**معايير التقييم:**
- الفصل الصحيح بين Horn وغير-Horn
- منطق اختيار الخوارزمية المناسبة حسب نوع الاستعلام
- الإشارة لمقايضة السرعة (Chaining) مقابل الاكتمال (Resolution)

---

## الجزء الرابع: بطاقات سؤال وجواب (Q&A Cards)

**Q1:** ما الفرق بين `Syntax` و`Semantics`؟
A: `Syntax` يحدد شكل الجملة الصحيح نحوياً، `Semantics` يحدد معناها/صحتها بالنسبة لعالم (model).

---

**Q2:** متى نقول `KB ⊨ α`؟
A: عندما تكون α صحيحة بكل نموذج (model) يكون فيه KB صحيحاً.

---

**Q3:** ما الفرق بين `Entailment` و`Inference`؟
A: `Entailment` علاقة منطقية موجودة أصلاً (⊨)، `Inference` خوارزمية فعلية لاكتشافها (⊢ᵢ).

---

**Q4:** ما تعريف `Sound` لخوارزمية استدلال؟
A: كل ما تستنتجه الخوارزمية يكون مستلزماً فعلاً من KB (لا تكذب أبداً).

---

**Q5:** ما تعريف `Complete` لخوارزمية استدلال؟
A: تجد كل الجمل المستلزَمة فعلياً من KB دون أن تفوّت أياً منها.

---

**Q6:** ما هو `Horn Clause`؟
A: إما رمز مفرد، أو اقتران رموز يستلزم رمزاً واحداً (`α1∧...∧αn ⇒ β`).

---

**Q7:** لماذا Forward/Backward Chaining خطيان (linear) بينما TT-Entails أسّي؟
A: لأنهما محصوران بـ Horn Form وكل رمز يُعالج مرة واحدة فقط، بينما TT-Entails تعدّد كل النماذج الممكنة.

---

**Q8:** متى نفضّل `Backward Chaining` على `Forward Chaining`؟
A: عندما يكون لدينا هدف محدد واضح (goal-driven) ونريد تجنب استنتاج معلومات غير ذات علاقة.

---

**Q9:** ما هي `CNF`؟
A: اقتران من جمل-أو (clauses)، كل clause عبارة عن disjunction من literals.

---

**Q10:** ما القاعدة الأساسية لـ `Resolution`؟
A: من جملتين تحتويان literals متناقضة، احذف الـliterals المتناقضة وادمج الباقي بجملة جديدة.

---

**Q11:** لماذا `Resolution` أهم من `Modus Ponens`؟
A: لأنها كاملة (complete) لكل المنطق القضوي بدون قيد Horn Form، بينما Modus Ponens محصورة بـ Horn Form.

---

**Q12:** كيف نثبت `KB ⊨ α` باستخدام Resolution؟
A: نفترض `¬α`، نحوّل `KB∧¬α` لـ CNF، ونطبق Resolution حتى نصل لجملة فارغة (تناقض) تثبت α.

---

**Q13:** ما معنى جملة `Valid` (تناقض القيمة)؟
A: جملة صحيحة بكل نموذج ممكن دون استثناء (مثل `A∨¬A`).

---

**Q14:** ما معنى جملة `Unsatisfiable`؟
A: جملة خاطئة بكل نموذج ممكن (مثل `A∧¬A`).

---

**Q15:** ما هي الخطوات الأربع لتحويل جملة إلى CNF؟
A: 1) إزالة ⇔، 2) إزالة ⇒، 3) نقل النفي للداخل (De Morgan)، 4) تطبيق التوزيع (distributivity).

---

**Q16:** لماذا `Wumpus World` بيئة `Partially Observable`؟
A: لأن الوكيل يدرك فقط المربع الحالي محلياً (Breeze/Smell/Glitter)، وليس الخريطة كاملة.

---

**Q17:** ما الفرق بين `Model Checking` و`Resolution` كطريقة إثبات؟
A: `Model Checking` تعداد شامل أسّي لكل النماذج، بينما `Resolution` استدلال جبري متدرج يعتمد على البرهان بالتناقض.

---

**Q18:** ما استراتيجية `coercion` بـ Wumpus World؟
A: إطلاق السهم للأمام عندما يكون الوكيل عالقاً بدون خيار آمن — كلا نتيجتَي الإطلاق تجعل المربع آمناً.

---

## الجزء الخامس: الخوارزميات الكاملة (مرجع Pseudocode)

> مرجع pseudocode كامل — بدون شرح جديد. كل خوارزمية في كتلة مستقلة.

```text
// KB-AGENT
function KB-AGENT(percept) returns an action
    static: KB, a knowledge base
            t, a counter, initially 0

    TELL(KB, MAKE-PERCEPT-SENTENCE(percept, t))
    action <- ASK(KB, MAKE-ACTION-QUERY(t))
    TELL(KB, MAKE-ACTION-SENTENCE(action, t))
    t <- t + 1
    return action
```

```text
// TT-ENTAILS? (Truth Table / Model Checking)
function TT-ENTAILS?(KB, alpha) returns true or false
    symbols <- a list of the proposition symbols in KB and alpha
    return TT-CHECK-ALL(KB, alpha, symbols, [])

function TT-CHECK-ALL(KB, alpha, symbols, model) returns true or false
    if EMPTY?(symbols) then
        if PL-TRUE?(KB, model) then return PL-TRUE?(alpha, model)
        else return true
    else do
        P <- FIRST(symbols); rest <- REST(symbols)
        return TT-CHECK-ALL(KB, alpha, rest, EXTEND(P, true, model)) and
               TT-CHECK-ALL(KB, alpha, rest, EXTEND(P, false, model))
```

```text
// PL-FC-ENTAILS? (Forward Chaining)
function PL-FC-ENTAILS?(KB, q) returns true or false
    inputs: KB, the knowledge base, a set of propositional Horn clauses
            q, the query, a proposition symbol
    local variables: count, a table, indexed by clause, initially the number of premises
                      inferred, a table, indexed by symbol, each entry initially false
                      agenda, a list of symbols, initially the symbols known in KB

    while agenda is not empty do
        p <- POP(agenda)
        unless inferred[p] do
            inferred[p] <- true
            for each Horn clause c in whose premise p appears do
                decrement count[c]
                if count[c] = 0 then do
                    if HEAD[c] = q then return true
                    PUSH(HEAD[c], agenda)
    return false
```

```text
// Backward Chaining (conceptual)
function BACKWARD-CHAIN(KB, goal, goal_stack) returns true or false
    if goal is known in KB then return true
    if goal in goal_stack then return false        // avoid infinite loop
    if goal already proved true then return true    // avoid repeated work
    if goal already failed then return false
    push goal onto goal_stack
    for each rule r with HEAD[r] = goal do
        if all premises of r proved by BACKWARD-CHAIN(KB, premise, goal_stack) then
            pop goal_stack
            mark goal as proved true
            return true
    pop goal_stack
    mark goal as failed
    return false
```

```text
// PL-RESOLUTION
function PL-RESOLUTION(KB, alpha) returns true or false
    inputs: KB, the knowledge base, a sentence in propositional logic
            alpha, the query, a sentence in propositional logic

    clauses <- the set of clauses in the CNF representation of KB and NOT-alpha
    new <- {}
    loop do
        for each Ci, Cj in clauses do
            resolvents <- PL-RESOLVE(Ci, Cj)
            if resolvents contains the empty clause then return true
            new <- new union resolvents
        if new subset-of clauses then return false
        clauses <- clauses union new
```

```text
// CNF Conversion (4 steps, conceptual)
function TO-CNF(sentence) returns CNF sentence
    step1: replace (alpha <=> beta) with (alpha => beta) and (beta => alpha)
    step2: replace (alpha => beta) with (not alpha) or beta
    step3: push negation inward using De Morgan and double-negation elimination
    step4: apply distributivity of OR over AND, then flatten nested ANDs/ORs
    return resulting CNF sentence
```

---

## الجزء الخامس: أسئلة نظرية متوقعة بالامتحان

### السؤال 1: ما هو Knowledge-Based Agent وكيف يعمل؟
**نموذج الإجابة:**
1. التعريف: وكيل يحتفظ بقاعدة معرفة (KB) من الجمل الرسمية ويستخدمها لاتخاذ قرارات.
2. المكونات/الشروط: `TELL` لإضافة معرفة، `ASK` للاستعلام، `Inference Engine` عام مستقل عن المجال.
3. مثال: وكيل Wumpus World يحدّث KB بكل إدراك ويستنتج المربعات الآمنة.
4. متى نستخدم: عندما نحتاج وكيلاً مرناً يستنتج قرارات لم تُبرمج صراحة، بدل قواعد ثابتة محددة سلفاً.

---

### السؤال 2: عرّف Entailment ووضح علاقته بـ Models.
**نموذج الإجابة:**
1. التعريف: `KB ⊨ α` تعني α صحيحة بكل نموذج يكون فيه KB صحيحاً.
2. المكونات/الشروط: `M(α)` مجموعة كل نماذج α، والشرط هو `M(KB) ⊆ M(α)`.
3. مثال: KB={الفريق أ فاز، الفريق ب فاز} تستلزم α="أ فاز أو ب فاز".
4. متى نستخدم: لتحديد أي استنتاج صحيح منطقياً يمكن اشتقاقه من معرفة موجودة.

---

### السؤال 3: ما الفرق بين Soundness و Completeness؟
**نموذج الإجابة:**
1. التعريف: Soundness = كل استنتاج صحيح فعلاً؛ Completeness = كل استلزام حقيقي يمكن اكتشافه.
2. المكونات/الشروط: `KB⊢ᵢα ⟹ KB⊨α` (sound)، `KB⊨α ⟹ KB⊢ᵢα` (complete).
3. مثال: TT-Entails? هي sound وcomplete لكن أسّية الزمن.
4. متى نستخدم: معياران أساسيان لتقييم أي خوارزمية استدلال منطقي.

---

### السؤال 4: اشرح 6 معايير توصيف بيئة Wumpus World.
**نموذج الإجابة:**
1. التعريف: معايير Environment Types (Observable, Deterministic, Episodic, Static, Discrete, Single-agent).
2. المكونات/الشروط: Wumpus = Partially Observable, Deterministic, Sequential, Static, Discrete, Single-agent.
3. مثال: الإدراك المحلي فقط (Breeze/Smell) يجعلها Partially Observable.
4. متى نستخدم: تحليل أي بيئة قبل اختيار نوع الوكيل المناسب (رد فعل بسيط أو قائم على معرفة).

---

### السؤال 5: ما هو Horn Clause ولماذا مهم للاستدلال؟
**نموذج الإجابة:**
1. التعريف: رمز مفرد أو اقتران رموز يستلزم رمزاً واحداً.
2. المكونات/الشروط: يسمح بتطبيق Modus Ponens بكفاءة خطية.
3. مثال: `C∧(B⇒A)∧(C∧D⇒B)`.
4. متى نستخدم: أنظمة قواعد بسيطة تحتاج استدلال سريع بدل Resolution العام.

---

### السؤال 6: قارن بين Forward Chaining و Backward Chaining.
**نموذج الإجابة:**
1. التعريف: FC يبدأ من الحقائق نحو الاستنتاجات (data-driven)، BC يبدأ من الهدف نحو المقدمات (goal-driven).
2. المكونات/الشروط: FC يستخدم agenda/count/inferred؛ BC يستخدم goal stack لتجنب الحلقات.
3. مثال: FC مناسب للتعرف التلقائي على الأنماط؛ BC مناسب لأسئلة محددة ("أين مفاتيحي؟").
4. متى نستخدم: FC عندما نريد كل الاستنتاجات؛ BC عندما لدينا سؤال هدف واحد محدد.

---

### السؤال 7: ما هي صيغة CNF ولماذا ضرورية لـ Resolution؟
**نموذج الإجابة:**
1. التعريف: اقتران من جمل-أو (disjunctions of literals).
2. المكونات/الشروط: تُبنى عبر 4 خطوات (إزالة ⇔، إزالة ⇒، نقل النفي، توزيع).
3. مثال: `(A∨¬B)∧(B∨¬C∨¬D)`.
4. متى نستخدم: أي تطبيق لقاعدة Resolution يتطلب هذه الصيغة الموحدة أولاً.

---

### السؤال 8: اشرح مبدأ البرهان بالتناقض في Resolution.
**نموذج الإجابة:**
1. التعريف: لإثبات `KB⊨α`، نفترض `¬α` ونثبت أن `KB∧¬α` غير قابلة للتحقق.
2. المكونات/الشروط: الوصول للجملة الفارغة (empty clause) يعني تناقضاً مطلقاً.
3. مثال: مثال [1,2] safe بالمحاضرة، تم إثباته عبر resolve متسلسل حتى الجملة الفارغة.
4. متى نستخدم: عندما KB يحتوي جملاً غير Horn Form وتحتاج قاعدة استدلال كاملة.

---

### السؤال 9: لماذا Resolution كاملة (complete) بينما Modus Ponens ليست كذلك عموماً؟
**نموذج الإجابة:**
1. التعريف: Resolution قاعدة استدلال واحدة كاملة لكل المنطق القضوي بعد تحويل CNF.
2. المكونات/الشروط: Modus Ponens محصورة بـ Horn Form فقط (شرط تعبيري ضيّق).
3. مثال: جملة `A∨B` (بدون implication) لا يمكن معالجتها بـ Modus Ponens لكن يمكن بـ Resolution.
4. متى نستخدم: أي KB عام غير محصور بـ Horn Form يتطلب Resolution.

---

### السؤال 10: ما استراتيجية Coercion في Wumpus World ولماذا تُستخدم؟
**نموذج الإجابة:**
1. التعريف: إطلاق السهم للأمام كإجراء استباقي عندما لا يوجد خيار آمن مؤكد.
2. المكونات/الشروط: تُستخدم عند الشك بوجود Wumpus أمام الوكيل (Smell) مع استحالة الحركة الآمنة.
3. مثال: Smell في [1,1] يمنع الحركة، فيطلق السهم — بكلتا النتيجتين (موت الوحش أو غيابه) يصبح المربع آمناً.
4. متى نستخدم: عند وصول الاستدلال المنطقي لطريق مسدود (لا يوجد قرار آمن مضمون منطقياً).

---

### السؤال 11: ما تعقيد Forward/Backward Chaining مقارنة بـ Model Checking؟
**نموذج الإجابة:**
1. التعريف: Chaining خطي O(size of KB) للـ Horn Form؛ Model Checking أسّي O(2ⁿ).
2. المكونات/الشروط: الفرق سببه تقييد Horn Form الذي يمنع الحاجة لتعداد كل النماذج.
3. مثال: مثال Forward Chaining بالمحاضرة (P,Q,L,M,A,B) استغرق عدد خطوات محدود بحجم KB.
4. متى نستخدم: نفضل Chaining دائماً عندما KB محصور Horn Form لتفادي التعقيد الأسّي.

---

## الجزء السادس: قائمة فحص ذاتي قبل الامتحان ✅

- [ ] أقدر أشرح الفرق بين `TELL` و`ASK` وأربطهم بحلقة `KB-Agent`.
- [ ] أقدر أحدد الستة معايير لتوصيف أي بيئة (`Observable`, `Deterministic`, `Episodic`, `Static`, `Discrete`, `Single-agent`) وأطبقها على Wumpus World.
- [ ] أفرّق بوضوح بين `Syntax` و`Semantics`.
- [ ] أفهم تعريف `Entailment` (`KB⊨α`) وأربطه بمفهوم `Models` (`M(KB)⊆M(α)`).
- [ ] أقدر أطبّق `Model Checking` (تعداد نماذج) يدوياً على مثال بسيط.
- [ ] أفرّق بين `Sound` و`Complete` بدقة (اتجاه العلاقة بكل حالة).
- [ ] أحفظ جدول الحقيقة لكل الروابط الخمسة (`¬, ∧, ∨, ⇒, ⇔`) بدون رجوع للمرجع.
- [ ] أفهم أن `P⇒Q` صحيحة تلقائياً إذا P خاطئة (vacuous truth).
- [ ] أميّز `Horn Clause` عن الجمل العامة، وأعرف حدود تعبيريتها.
- [ ] أقدر أتتبّع `Forward Chaining` بشكل كامل (agenda, count, inferred).
- [ ] أقدر أتتبّع `Backward Chaining` وأشرح أهمية `goal stack`.
- [ ] أقدر أحوّل أي جملة إلى `CNF` باتباع الخطوات الأربع بالترتيب الصحيح.
- [ ] أفهم قاعدة `Resolution` وأقدر أطبقها يدوياً حتى الوصول لجملة فارغة.
- [ ] أفهم لماذا `Resolution` كاملة لكل المنطق القضوي بينما `Modus Ponens` محصورة بـ Horn Form.
- [ ] أقدر أقارن `Forward Chaining` مقابل `Backward Chaining` (data-driven vs goal-driven).
- [ ] أفهم استراتيجيتي `probabilistic choice` و`coercion` كحلول بديلة عند غياب قرار منطقي آمن مضمون.
- [ ] راجعت كل الأمثلة العددية (شريحة 25-30، 38، 71) وأقدر أعيد إنتاجها بدون مساعدة.

---

## الجزء السادس: ورقة المراجعة السريعة (Cheat Sheet)

### 🔑 خريطة العلاقات بين المحاضرات
| المحاضرة | ترتبط مع | كيف؟ |
| --- | --- | --- |
| Intelligent Agents | Logical Agent | مفهوم `PEAS` و`Environment Types` أساس توصيف Wumpus World |
| Problem Solving & Search | Logical Agent | كلاهما يبحث عن حل ضمن فضاء حالات، لكن هنا الفضاء منطقي |
| Logical Agent | First-Order Logic | المنطق القضوي أساس بسيط، FOL يوسّعه بالكمّيات والعلاقات |

### 🔑 أهم النقاط الذهبية
| الموضوع | النقاط |
| --- | --- |
| Entailment | `KB⊨α ⟺ M(KB)⊆M(α) ⟺ (KB∧¬α) unsatisfiable` |
| Chaining | خطي، محصور بـ Horn Form، FC=data-driven، BC=goal-driven |
| Resolution | يعمل على CNF فقط، كامل لكل المنطق القضوي، مبني على البرهان بالتناقض |
| Wumpus World | Partially Observable + Sequential + Static + Discrete + Single-agent + Deterministic |

### 🔑 مرجع سريع
| الرمز/المصطلح | المعنى | يُستخدم في |
| --- | --- | --- |
| `⊨` | Entailment (استلزام رياضي) | تعريف الاستنتاج الصحيح |
| `⊢ᵢ` | Inference بخوارزمية i | Chaining، Resolution |
| `Pᵢ,ⱼ` | وجود Pit بمربع [i,j] | Wumpus World KB |
| `Bᵢ,ⱼ` | وجود Breeze بمربع [i,j] | Wumpus World KB |
| `CNF` | اقتران من جمل-أو | شرط تطبيق Resolution |
| `{}` (Empty Clause) | تناقض مطلق | نجاح إثبات Resolution |

### 🔑 قواعد ذهبية لا تُنسى
| # | القاعدة |
| --- | --- |
| 1 | `KB⊨α` علاقة موجودة أصلاً؛ الخوارزمية (`⊢ᵢ`) مجرد وسيلة لاكتشافها |
| 2 | `P⇒Q` صحيحة تلقائياً كل مرة تكون فيها P خاطئة |
| 3 | Modus Ponens يعمل فقط على Horn Form؛ Resolution تعمل على أي CNF |
| 4 | لإثبات α بـ Resolution: افترض `¬α`، ابحث عن تناقض (جملة فارغة) |
| 5 | ترتيب تحويل CNF: ⇔ أولاً، ثم ⇒، ثم نقل النفي، ثم التوزيع — بهذا الترتيب دائماً |
| 6 | استخدم `⇔` وليس `⇒` عند صياغة قواعد "سبب ⟺ نتيجة" مثل Breeze/Pit |

---

<!-- VALIDATION: تم تغطية كل شرائح المحاضرة (1–72) بالكامل — Knowledge-based Agents, Wumpus World PEAS, Environment Characterization, Exploring Wumpus World, Logic in General, Entailment, Models, Inference (Soundness/Completeness), Propositional Logic Syntax/Semantics, Wumpus World Sentences, Truth Table Inference, Logical Equivalence, Validity/Satisfiability, Proof Methods, Forward/Backward Chaining (Horn Form), Resolution, CNF Conversion. تضمّن الملف: 18 MCQ، 6 أسئلة تصحيح pseudocode، 7 تمارين تطبيقية، 4 تمارين تحليل، 4 تمارين تتبع خطوة بخطوة، سؤالي تصميم، 18 بطاقة Q&A، مرجع pseudocode كامل (6 خوارزميات)، 11 سؤال نظري، قائمة فحص ذاتي، وورقة مراجعة سريعة. -->
