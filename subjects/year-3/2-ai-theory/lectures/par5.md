# المحاضرة 12 — Inference in First-Order Logic (الاستنتاج في منطق المرتبة الأولى)

> **المادة:** الذكاء الاصطناعي (القسم النظري) | **الموضوع:** الاستنتاج في منطق المرتبة الأولى — `Universal Instantiation`، `Existential Instantiation`، `Unification`، `Generalized Modus Ponens`، `Forward Chaining`، `Backward Chaining`، `Resolution`

---

## 📌 خريطة التكامل (أين تقع هذه المحاضرة في الدورة؟)

| المرحلة | الأدوات | المخرجات |
| --- | --- | --- |
| 1 — تمثيل المعرفة (Propositional Logic) | `Entailment`، `Truth Tables`، `Resolution` | قاعدة معرفة محدودة |
| 2 — منطق المرتبة الأولى (FOL Syntax/Semantics) | `Quantifiers`، `Predicates`، `Functions` | صياغة قاعدة معرفة غنية |
| **3 — الاستنتاج في FOL ← أنت هنا** | `UI`، `EI`، `GMP`، `Unification`، `Forward/Backward Chaining`، `Resolution` | **إثبات جُمَل جديدة آلياً** |
| 4 — التعلم الآلي | `Supervised`، `Unsupervised`، `Gradient Descent` | نماذج تتعلم من البيانات |

> **نوع هذه المحاضرة:** نظري + خوارزميات + تتبع تنفيذ (`algorithm_trace`) — تركّز على كيفية استنتاج حقائق جديدة آلياً من قاعدة معرفة مكتوبة بـ `FOL`.

---

## الجزء الأول: الشرح التفصيلي

---

### 1. نظرة عامة — ما الهدف من هذه المحاضرة؟

#### النص الأصلي يقول:
> المحاضرة تغطي: Reducing first-order inference to propositional inference | Unification | Generalized Modus Ponens | Forward and backward chaining | Logic programming | Resolution

#### الشرح المبسّط:
لدينا قاعدة معرفة (`KB`) مكتوبة بمنطق المرتبة الأولى `FOL` — يعني فيها متحولات وكميّات (`∀`، `∃`). السؤال: كيف نستنتج حقائق جديدة آلياً؟

المحاضرة تقدّم **ثلاثة مسارات**:
1. **التحويل إلى منطق قضايا** (`Propositionalization`) ثم تطبيق ما نعرفه
2. **التسلسل الأمامي** (`Forward Chaining`) — من الحقائق إلى الهدف
3. **التسلسل الخلفي** (`Backward Chaining`) — من الهدف إلى الحقائق
4. **الدحض** (`Resolution`) — تقنية استنتاج كاملة

**لماذا؟** لأن `FOL` أقوى من المنطق القضوي لكنه يحتاج أدوات استنتاج خاصة.

#### 💡 التشبيه:
> لديك قانون يقول «كل من يسرق يُعاقَب» + حقيقة «علي سرق». كيف تثبت «علي يُعاقَب» آلياً؟ هذا هو موضوع المحاضرة.
> **وجه الشبه:** القانون العام = `∀x`، الحقيقة الفردية = Ground Fact، الاستنتاج = الإجراء القضائي.

---

### 2. Universal Instantiation (UI) — التعميم الكلي التعييني

#### النص الأصلي يقول:
> Every instantiation of a universally quantified sentence is entailed by it.
> $$\frac{\forall v \;\alpha}{\text{SUBST}(\{v/g\},\alpha)}$$
> for any variable $v$ and ground term $g$

#### الشرح المبسّط:
`UI` تقول: إذا كان شيء صحيحاً لـ **كل** `x`، فهو صحيح لأي قيمة محددة تضعها بدلاً من `x`.

**مثال المحاضرة:**
من `∀x King(x) ∧ Greedy(x) ⇒ Evil(x)` نستنتج:
- `King(John) ∧ Greedy(John) ⇒ Evil(John)`  (بوضع `x = John`)
- `King(Richard) ∧ Greedy(Richard) ⇒ Evil(Richard)` (بوضع `x = Richard`)
- `King(Father(John)) ∧ Greedy(Father(John)) ⇒ Evil(Father(John))` (بوضع `x = Father(John)`)

#### 📐 المعادلة: SUBST

$$\frac{\forall v \;\alpha}{\text{SUBST}(\{v/g\},\alpha)}$$

**الشرح:**
- $\forall v$ : الكمّ الكلي على المتحول $v$
- $\alpha$ : الجملة المكمَّمة
- $g$ : `ground term` — قيمة محددة لا تحتوي متحولات
- $\text{SUBST}(\{v/g\},\alpha)$ : استبدال كل ظهور لـ $v$ بـ $g$ داخل $\alpha$

**لماذا مهم؟** `UI` يمكن تطبيقه **مرات غير محدودة** ويضيف جُملاً جديدة للـ `KB` مع الحفاظ على التكافؤ المنطقي.

#### 💡 التشبيه:
> القانون يقول «كل مواطن له حق التصويت». بمجرد أن أثبت أن أحمد مواطن، أطبّق القانون عليه مباشرة.
> **وجه الشبه:** `∀x` = القانون، `g = أحمد` = الحالة الفردية، `SUBST` = التطبيق على الحالة.

---

### 3. Existential Instantiation (EI) — التعميم الوجودي التعييني

#### النص الأصلي يقول:
> For any sentence α, variable v, and constant symbol k that does not appear elsewhere in the knowledge base:
> $$\frac{\exists v \;\alpha}{\text{SUBST}(\{v/k\},\alpha)}$$
> E.g., ∃x Crown(x) ∧ OnHead(x, John) yields Crown(C₁) ∧ OnHead(C₁, John)
> provided C₁ is a new constant symbol, called a **Skolem constant**

#### الشرح المبسّط:
`EI` تقول: إذا علمنا أن شيئاً موجوداً (بدون معرفة من هو)، نعطيه اسماً جديداً لم يُذكر من قبل.

**مثال 1 من المحاضرة:**
من `∃x Crown(x) ∧ OnHead(x, John)`:
- لا نعرف من يحمل التاج بالضبط
- نعطي هذا الشيء اسماً: `C₁` (يُسمى `Skolem constant`)
- نستنتج: `Crown(C₁) ∧ OnHead(C₁, John)`

**مثال 2 من المحاضرة:**
من `∃x d(xʸ)/dy = xʸ` نستنتج `d(eʸ)/dy = eʸ` (حيث `e` ثابت سكولم جديد).

#### مهم للامتحان ⚠️:
> `Skolem constant` هو **ثابت جديد كلياً** لم يظهر في `KB` من قبل — لا تستخدم ثابتاً موجوداً.

---

### 4. الفرق الجوهري بين UI و EI

#### النص الأصلي يقول:
> UI can be applied several times to **add** new sentences; the new KB is logically equivalent to the old.
> EI can be applied once to **replace** the existential sentence; the new KB is **not** equivalent to the old, but is satisfiable iff the old KB was satisfiable.

#### الشرح المبسّط:

| الخاصية | `UI` | `EI` |
| --- | --- | --- |
| عدد مرات التطبيق | غير محدود | مرة واحدة فقط |
| العلاقة بالـ KB الأصلي | **تكافؤ منطقي** | ليست مكافئة (لكن متوافقة في الإشباع) |
| الأثر | **إضافة** جمل جديدة | **استبدال** الجملة الوجودية |
| الرمز | `∀v` | `∃v` |

**لماذا هذا الفرق مهم؟** لأن `EI` تُفقدنا معلومة «ماهية» الشيء الموجود — لكنها تحافظ على **وجوده** المنطقي.

#### 💡 التشبيه:
> `UI`: قانون يقول «كل موظف مؤمَّن» — يمكنك تطبيقه على مئة موظف.
> `EI`: «هناك شخص يملك المفتاح» — نسميه `X` مرة واحدة ونمضي.
> **وجه الشبه:** `EI` = إعطاء اسم مجهول لحل مؤقت.

---

### 5. Reduction to Propositional Inference — التحويل إلى منطق القضايا

#### النص الأصلي يقول:
> Suppose the KB contains: ∀x King(x)∧Greedy(x)⇒Evil(x), King(John), Greedy(John), Brother(Richard,John)
> Instantiating the universal sentence in all possible ways, we have...
> The new KB is **propositionalized**: proposition symbols are King(John), Greedy(John), Evil(John), King(Richard) etc.

#### الشرح المبسّط:
**الفكرة:** حوّل `FOL KB` إلى `Propositional KB` بتطبيق `UI` بكل الطرق الممكنة، ثم استخدم آليات الاستنتاج القضوي.

**مثال المحاضرة:**
- KB الأصلي: `∀x King(x)∧Greedy(x)⇒Evil(x)` + `King(John)` + `Greedy(John)` + `Brother(Richard,John)`
- بعد التحويل: أنتجنا `King(John)∧Greedy(John)⇒Evil(John)` + `King(Richard)∧Greedy(Richard)⇒Evil(Richard)` + الحقائق الأصلية
- النتيجة قضوية: رموزها `King(John)`، `Greedy(John)`، `Evil(John)`، `King(Richard)`، إلخ

**نقاط مهمة من المحاضرة:**
- **ادعاء 1:** جملة أرضية (`ground sentence`) معلولة بالـ KB الجديد ⟺ معلولة بالـ KB الأصلي
- **ادعاء 2:** كل `FOL KB` يمكن تحويله إلى قضوي مع الحفاظ على الاستلزام
- **مبرهنة هربراند (1930):** إذا كانت جملة `α` معلولة بـ `FOL KB`، فهي معلولة بمجموعة **منتهية** من الـ `KB` القضوي

---

### 6. Problems with Propositionalization — مشاكل التحويل القضوي

#### النص الأصلي يقول:
> Propositionalization seems to generate lots of irrelevant sentences.
> With p k-ary predicates and n constants, there are p·nᵏ instantiations
> With function symbols, it gets much much worse!
> **Claim:** entailment in FOL is **semidecidable**
> **Theorem (Turing/Church 1936):** entailment in FOL is semidecidable

#### الشرح المبسّط:
المشكلة الرئيسية: `Propositionalization` **ينتج جُملاً غير ذات صلة** كثيرة جداً.

**مثال:** من `∀y Greedy(y)` و `∀x King(x)∧Greedy(x)⇒Evil(x)` يبدو واضحاً أن `Evil(John)`، لكن التحويل القضوي ينتج حقائق مثل `Greedy(Richard)` التي لا علاقة لها بالسؤال.

**المشكلة الأعمق:**
- مع `p` محمولات `k`-ارية و `n` ثابتاً: هناك `p·nᵏ` تعيين ممكن
- مع دوال (`function symbols`): لا نهاية للـ `ground terms` (مثل `Father(Father(Father(John)))`)
- **الفكرة الذكية:** تطبيق `UI` مع عمق متزايد من 0 إلى ∞ — إذا كانت `α` معلولة ستُكتشف، لكن إذا لم تكن معلولة **لن تتوقف الحلقة** → الاستنتاج **نصف قابل للقرار** (`semidecidable`)

#### مهم للامتحان ⚠️:
> `Entailment` في `FOL` هو `semidecidable`: إذا كانت الجملة معلولة نستطيع إثباتها في وقت منتهٍ. أما إذا لم تكن معلولة، قد تدور الحلقة إلى الأبد.

---

### 7. Unification — التوحيد

#### النص الأصلي يقول:
> We can get the inference immediately if we can find a substitution θ such that King(x) and Greedy(x) match King(John) and Greedy(y)
> θ = {x/John, y/John} works
> UNIFY(α, β) = θ if αθ = βθ

#### الشرح المبسّط:
**الفكرة الجوهرية:** بدلاً من توليد كل التعيينات الممكنة، نجد مباشرةً التعيين `θ` الذي يجعل الأنماط **متطابقة**.

`Unification` هو: إيجاد إحلال (`substitution`) يجعل تعبيرَين أو أكثر متطابقَيْن.

**جدول أمثلة المحاضرة:**

| p | q | θ (المُوحِّد) |
| --- | --- | --- |
| `Knows(John, x)` | `Knows(John, Jane)` | `{x/Jane}` |
| `Knows(John, x)` | `Knows(y, OJ)` | `{x/OJ, y/John}` |
| `Knows(John, x)` | `Knows(y, Mother(y))` | `{y/John, x/Mother(John)}` |
| `Knows(John, x)` | `Knows(x, OJ)` | `fail` (تعارض: x=John وx=OJ في نفس الوقت) |

**Standardizing Apart:** لحل تعارض المتحولات، نُعيد تسمية متحولات إحدى الجملتين — مثلاً `Knows(z₁₇, OJ)` بدلاً من `Knows(x, OJ)`.

#### 📐 المعادلة: Unification

$$\text{UNIFY}(\alpha, \beta) = \theta \quad \text{if} \quad \alpha\theta = \beta\theta$$

**الشرح:**
- $\alpha$، $\beta$: التعبيران المراد توحيدهما
- $\theta$: `substitution` — مجموعة من الاستبدالات `{var/term, ...}`
- $\alpha\theta$: نتيجة تطبيق `θ` على `α`

#### 💡 التشبيه:
> `Unification` مثل تعبئة الفراغات في جملتين حتى تصبحا نفس الجملة.
> «سافر \_\_\_ إلى باريس» + «سافر أحمد إلى \_\_\_» → التوحيد: الأول=أحمد، الثاني=باريس.
> **وجه الشبه:** المتحولات = فراغات، `θ` = التعبئة.

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** لماذا تفشل `UNIFY(Knows(John,x), Knows(x,OJ))`؟
> **لماذا هذا مهم؟** لأن تعيين `x=John` وفي نفس الوقت `x=OJ` يعني `John=OJ` — وهذا تعارض. الحل: `Standardize Apart` ليصبح متحول الثانية `z₁₇`.

---

### 8. Generalized Modus Ponens (GMP)

#### النص الأصلي يقول:
> $$\frac{p_1',\; p_2',\; \ldots,\; p_n',\;\;(p_1 \wedge p_2 \wedge \ldots \wedge p_n \Rightarrow q)}{q\theta}$$
> where $p_i'\theta = p_i\theta$ for all i
> GMP used with KB of **definite clauses** (exactly one positive literal). All variables assumed universally quantified.

#### الشرح المبسّط:
`GMP` = `Modus Ponens` المُعمَّم ليعمل مع متحولات.

**الفكرة:**
- لدينا حقائق: `p₁'، p₂'، ...، pₙ'`
- لدينا قاعدة: `(p₁ ∧ p₂ ∧ ... ∧ pₙ ⇒ q)`
- إذا وجدنا `θ` بحيث `pᵢ'θ = pᵢθ` لكل `i`
- نستنتج: `qθ`

**مثال المحاضرة التفصيلي:**
- `p₁'` = `King(John)` ، `p₁` = `King(x)`
- `p₂'` = `Greedy(y)` (من `∀y Greedy(y)`) ، `p₂` = `Greedy(x)`
- `θ` = `{x/John, y/John}`
- `q` = `Evil(x)` → `qθ` = `Evil(John)` ✅

**`Definite Clause`:** جملة بها **بالضبط متحول إيجابي واحد** — مثلاً `¬p₁ ∨ ¬p₂ ∨ q` (ما يقابل `p₁ ∧ p₂ ⇒ q`).

#### ⚖️ المقايضة: GMP مقابل التحويل القضوي

| | `GMP` | `Propositionalization` |
| --- | --- | --- |
| المزايا | يعمل مباشرة بالمتحولات | لا يحتاج `Unification` |
| العيوب | يقتصر على `Definite Clauses` | ينفجر عدد الجمل |
| متى تختاره | قواعد معرفة منظمة (هرمية) | لـ KB صغير محدود |

---

### 9. Soundness of GMP — صحة GMP

#### النص الأصلي يقول:
> Need to show that: p₁',...,pₙ', (p₁∧...∧pₙ⇒q) ⊨ qθ provided that pᵢ'θ = pᵢθ for all i
> Lemma: For any definite clause p, we have p ⊨ pθ by UI
> 1. (p₁∧...∧pₙ⇒q) ⊨ (p₁∧...∧pₙ⇒q)θ = (p₁θ∧...∧pₙθ⇒qθ)
> 2. p₁',...,pₙ' ⊨ p₁'∧...∧pₙ' ⊨ p₁'θ∧...∧pₙ'θ
> 3. From 1 and 2, qθ follows by ordinary Modus Ponens

#### الشرح المبسّط:
إثبات صحة `GMP` يتم بثلاث خطوات:
1. **القاعدة بعد التعيين:** `(p₁∧...∧pₙ⇒q)θ = (p₁θ∧...∧pₙθ⇒qθ)` ← بتطبيق `UI`
2. **الحقائق بعد التعيين:** `p₁'θ = p₁θ` لكل `i` (تعريف التوحيد)
3. **النتيجة:** من الخطوتين + `Modus Ponens` العادي → `qθ` صحيحة ✅

---

### 10. Example Knowledge Base — مثال قاعدة المعرفة (قضية غرب المجرم)

#### النص الأصلي يقول:
> The law says that it is a crime for an American to sell weapons to hostile nations. The country Nono, an enemy of America, has some missiles, and all of its missiles were sold to it by Colonel West, who is American.
> **Prove that Col. West is a criminal.**

#### الشرح المبسّط:
هذا مثال كلاسيكي يُستخدم طوال المحاضرة لشرح `Forward Chaining`، `Backward Chaining`، و`Resolution`.

**ترميز قاعدة المعرفة بـ FOL:**

| الحقيقة الطبيعية | الترميز بـ FOL |
| --- | --- |
| من يبيع أسلحة لدولة عدائية وهو أمريكي فهو مجرم | `American(x)∧Weapon(y)∧Sells(x,y,z)∧Hostile(z) ⇒ Criminal(x)` |
| نونو يملك بعض الصواريخ | `Owns(Nono,M₁)` و `Missile(M₁)` |
| كل صاروخ تملكه نونو بيعه لها الكولونيل ويست | `∀x Missile(x)∧Owns(Nono,x) ⇒ Sells(West,x,Nono)` |
| الصواريخ أسلحة | `Missile(x) ⇒ Weapon(x)` |
| عدو أمريكا دولة عدائية | `Enemy(x,America) ⇒ Hostile(x)` |
| ويست أمريكي | `American(West)` |
| نونو عدو أمريكا | `Enemy(Nono,America)` |

**الهدف:** إثبات `Criminal(West)`

---

### 11. Forward Chaining Algorithm — خوارزمية التسلسل الأمامي

#### النص الأصلي يقول:
> function FOL-FC-ASK(KB, α) returns a substitution or false

#### الشرح المبسّط:
**التسلسل الأمامي** = ابدأ من الحقائق المعروفة، طبّق القواعد، اشتق حقائق جديدة، حتى تصل للهدف.

💡 **التشبيه:**
> مثل محقق يجمع الأدلة واحداً تلو الآخر حتى يثبت التهمة.
> **وجه الشبه:** الأدلة = حقائق `KB`، القواعد = القوانين، الاستنتاج = الحكم.

#### 💻 الكود: FOL-FC-ASK

#### ما هذا الكود؟
> خوارزمية `Forward Chaining` في `FOL` — تشتق جُملاً جديدة بتطبيق `GMP` على الحقائق المعروفة حتى تحقق الهدف أو تستنفد الاشتقاقات.

```text
// FOL-FC-ASK: Forward Chaining for First-Order Logic
function FOL-FC-ASK(KB, α) returns a substitution or false

  repeat until new is empty          // Keep iterating as long as new facts appear
    new ← {}                          // Initialize new facts set
    for each sentence r in KB do      // Scan every rule in KB
      (p1 ∧ ... ∧ pn ⇒ q) ← STANDARDIZE-APART(r)  // Rename vars to avoid clashes
      for each θ such that                 // Find all matching substitutions
          (p1 ∧ ... ∧ pn)θ = (p1' ∧ ... ∧ pn')θ    // Unify premises with KB facts
          for some p1',...,pn' in KB
        q' ← SUBST(θ, q)              // Apply substitution to conclusion
        if q' is not a renaming of a sentence already in KB or new then
          add q' to new               // Add new derived fact
          φ ← UNIFY(q', α)            // Check if goal is achieved
          if φ is not fail then return φ  // Return substitution if goal matched
    add new to KB                     // Add all new facts to KB
  return false                        // Goal not entailed
```

#### شرح كل سطر:
1. `repeat until new is empty` → تكرار حتى لا تظهر حقائق جديدة — شرط التوقف
2. `new ← {}` → إفراغ مجموعة الحقائق الجديدة في كل دورة
3. `for each sentence r in KB` → مسح كل قاعدة في `KB`
4. `STANDARDIZE-APART(r)` → إعادة تسمية المتحولات لتجنب التعارض
5. `for each θ` → إيجاد كل التعيينات التي توحّد مقدمات القاعدة مع حقائق `KB`
6. `q' ← SUBST(θ, q)` → توليد الاستنتاج الجديد بتطبيق التعيين
7. `if q' is not a renaming...` → تجنب إضافة نسخ مكررة
8. `add q' to new` → إضافة الحقيقة الجديدة
9. `φ ← UNIFY(q', α)` → محاولة مطابقة الحقيقة الجديدة مع الهدف
10. `if φ is not fail then return φ` → إذا طابق الهدف → نجاح
11. `add new to KB` → إضافة الحقائق الجديدة للـ `KB` قبل الدورة التالية
12. `return false` → إذا انتهت الدورات دون تحقيق الهدف

**الناتج المتوقع:**
> تعيين `θ` يجعل الهدف متحققاً، أو `false` إذا لم يكن الهدف معلولاً بالـ `KB`.

---

### 12. Forward Chaining Proof — تتبع إثبات المثال

#### النص الأصلي يقول:
> [مخطط التسلسل الأمامي بخطوتين]
> الطبقة الأولى: American(West), Missile(M1), Owns(Nono,M1), Enemy(Nono,America)
> الطبقة الثانية: Weapon(M1), Sells(West,M1,Nono), Hostile(Nono)
> النتيجة النهائية: Criminal(West)

#### 🔍 تتبع التنفيذ: Forward Chaining على مثال Colonel West

**المدخل:** قاعدة المعرفة المذكورة في القسم 10 والهدف `Criminal(West)`

| الخطوة | القاعدة المطبقة | الاستنتاج الجديد |
| --- | --- | --- |
| 0 | حقائق أولية | `American(West)`, `Missile(M₁)`, `Owns(Nono,M₁)`, `Enemy(Nono,America)` |
| 1 | `Missile(x)⇒Weapon(x)` مع `x=M₁` | `Weapon(M₁)` |
| 2 | `Missile(x)∧Owns(Nono,x)⇒Sells(West,x,Nono)` مع `x=M₁` | `Sells(West,M₁,Nono)` |
| 3 | `Enemy(x,America)⇒Hostile(x)` مع `x=Nono` | `Hostile(Nono)` |
| 4 | القاعدة الجنائية مع `x=West,y=M₁,z=Nono` | `Criminal(West)` ✅ |

**النتيجة:** `Criminal(West)` ثُبتت في 4 خطوات.

---

### 13. Properties of Forward Chaining — خصائص التسلسل الأمامي

#### النص الأصلي يقول:
> Sound and complete for first-order definite clauses (proof similar to propositional proof)
> Datalog = first-order definite clauses + **no functions** (e.g., crime KB)
> FC terminates for Datalog in poly iterations: at most p·nᵏ literals
> May not terminate in general if α is not entailed
> This is unavoidable: entailment with definite clauses is semidecidable

#### الشرح المبسّط:

| الخاصية | التفاصيل |
| --- | --- |
| **صحة** (`Soundness`) | ✅ — كل ما يُستنتج صحيح |
| **اكتمال** (`Completeness`) | ✅ — لـ `Definite Clauses` |
| `Datalog` | `FOL Definite Clauses` بدون دوال → يتوقف في `p·nᵏ` تكراراً |
| مع الدوال | قد لا يتوقف إذا لم يكن الهدف معلولاً |
| التعقيد | مطابقة المقدمات مع الحقائق هي مشكلة `NP-hard` |

---

### 14. Efficiency of Forward Chaining — كفاءة التسلسل الأمامي

#### النص الأصلي يقول:
> Simple observation: no need to match a rule on iteration k if a premise wasn't added on iteration k-1
> ⇒ match each rule whose premise contains a newly added literal
> Database indexing allows O(1) retrieval of known facts
> e.g., query Missile(x) retrieves Missile(M₁)
> Matching conjunctive premises against known facts is NP-hard
> Forward chaining is widely used in **deductive databases**

#### الشرح المبسّط:

**تحسين 1:** لا داعي لإعادة مطابقة قاعدة إذا لم تتغير أي من مقدماتها — **فقط القواعد التي تحتوي الحقائق الجديدة**.

**تحسين 2:** `Database Indexing` للحقائق → استرجاع `O(1)`.

**تحدٍّ أساسي:** مطابقة مقدمات متعددة مع حقائق معروفة = `NP-hard` (يتضح من مثال `Hard Matching`).

#### 📊 المخطط: Hard Matching Example (تلوين الخريطة)

#### ما هذا المخطط؟
> يوضح أن مطابقة قاعدة بمقدمات متعددة (`conjunctive premises`) مع الحقائق هي مشكلة `CSP` مكافئة لـ `3SAT`.

القاعدة: `Diff(wa,nt)∧Diff(wa,sa)∧Diff(nt,q)∧...∧Diff(v,sa) ⇒ Colorable()`

مع الحقائق: `Diff(Red,Blue)، Diff(Red,Green)، Diff(Green,Red)، ...`

→ `Colorable()` يُستنتج ⟺ `CSP` له حل → وهذا `NP-hard`.

---

### 15. Backward Chaining Algorithm — خوارزمية التسلسل الخلفي

#### النص الأصلي يقول:
> function FOL-BC-ASK(KB, goals, θ) returns a set of substitutions
> if goals is empty then return {θ}
> ...for each sentence r in KB where STANDARDIZE-APART(r) = (p1∧...∧pn⇒q) and θ' ← UNIFY(q,q') succeeds

#### الشرح المبسّط:
**التسلسل الخلفي** = ابدأ من الهدف، اسأل «ماذا أحتاج لإثباته؟»، ارجع إلى الحقائق.

💡 **التشبيه:**
> مثل محامي دفاع يبدأ من نتيجة «موكلي بريء» ثم يبحث عن الأدلة التي تثبت ذلك بالأثر الرجعي.
> **وجه الشبه:** الهدف = الحكم المُراد، القواعد = المسارات للأدلة، الحقائق = الأدلة النهائية.

#### 💻 الكود: FOL-BC-ASK

#### ما هذا الكود؟
> خوارزمية `Backward Chaining` — تحل من الهدف إلى الخلف بعمق أول (`Depth-First`)، وتُعيد مجموعة كل التعيينات المُحققة للهدف.

```text
// FOL-BC-ASK: Backward Chaining for First-Order Logic
function FOL-BC-ASK(KB, goals, θ) returns a set of substitutions
  inputs: KB - knowledge base
          goals - list of conjuncts (query with θ already applied)
          θ - current substitution, initially {}
  local variables: answers - set of substitutions, initially empty

  if goals is empty then return {θ}        // Base case: all goals satisfied
  q' ← SUBST(θ, FIRST(goals))              // Get first goal with current substitution
  for each sentence r in KB                // Try each KB sentence
    where STANDARDIZE-APART(r) = (p1∧...∧pn ⇒ q)  // Separate variables
    and θ' ← UNIFY(q, q') succeeds         // Try to unify rule head with goal
    new_goals ← [p1,...,pn | REST(goals)]  // Prepend new subgoals
    answers ← FOL-BC-ASK(KB, new_goals, COMPOSE(θ',θ)) ∪ answers  // Recurse
  return answers                           // Return all successful substitutions
```

#### شرح كل سطر:
1. `if goals is empty then return {θ}` → حالة القاعدة: إذا لم تبقَ أهداف، التعيين الحالي هو حل
2. `q' ← SUBST(θ, FIRST(goals))` → أخذ الهدف الأول بعد تطبيق التعيين الحالي
3. `for each sentence r in KB` → المحاولة مع كل قاعدة في `KB`
4. `STANDARDIZE-APART(r)` → منع تعارض المتحولات
5. `UNIFY(q, q') succeeds` → مطابقة رأس القاعدة مع الهدف
6. `new_goals ← [p1,...,pn | REST(goals)]` → الأهداف الجديدة = مقدمات القاعدة + بقية الأهداف
7. `FOL-BC-ASK(KB, new_goals, COMPOSE(θ',θ))` → استدعاء تكراري مع التعيين المركّب
8. `return answers` → إعادة كل التعيينات الناجحة

**الناتج المتوقع:**
> مجموعة من التعيينات `{θ₁, θ₂, ...}` كل منها يحقق الهدف.

---

### 16. Backward Chaining Example — تتبع إثبات المثال خلفياً

#### النص الأصلي يقول:
> [مخطط التسلسل الخلفي من Criminal(West) إلى الحقائق الأولية]
> بدأ من Criminal(West) → {x/West}
> ثم الأهداف: American(x), Weapon(y), Sells(x,y,z), Hostile(z)
> American(West) ← {} | Weapon(y) → Missile(y) → {y/M1}
> Sells(West,M1,z) ← {z/Nono} | Hostile(Nono) ← Enemy(Nono,America) ← {}

#### 🔍 تتبع التنفيذ: Backward Chaining على مثال Colonel West

**المدخل:** `KB` من القسم 10، الهدف: `Criminal(West)`

| الخطوة | الهدف الحالي | القاعدة المستخدمة | التعيين |
| --- | --- | --- | --- |
| 1 | `Criminal(West)` | `American(x)∧Weapon(y)∧Sells(x,y,z)∧Hostile(z)⇒Criminal(x)` | `{x/West}` |
| 2 | `American(West)` | حقيقة مباشرة في `KB` | `{}` |
| 3 | `Weapon(y)` | `Missile(y)⇒Weapon(y)` | - |
| 4 | `Missile(y)` | حقيقة `Missile(M₁)` | `{y/M₁}` → التعيين يصبح `{x/West, y/M₁}` |
| 5 | `Sells(West,M₁,z)` | `Missile(x)∧Owns(Nono,x)⇒Sells(West,x,Nono)` مع `x=M₁` | `{z/Nono}` |
| 6 | `Missile(M₁)` | حقيقة | `{}` |
| 7 | `Owns(Nono,M₁)` | حقيقة | `{}` |
| 8 | `Hostile(Nono)` | `Enemy(x,America)⇒Hostile(x)` مع `x=Nono` | - |
| 9 | `Enemy(Nono,America)` | حقيقة | `{}` |
| **النتيجة** | جميع الأهداف محققة | - | `{x/West, y/M₁, z/Nono}` ✅ |

**النتيجة:** `Criminal(West)` مثبتة بالتسلسل الخلفي.

---

### 17. Properties of Backward Chaining — خصائص التسلسل الخلفي

#### النص الأصلي يقول:
> Depth-first recursive proof search: space is linear in size of proof
> Incomplete due to infinite loops ⇒ fix by checking current goal against every goal on stack
> Inefficient due to repeated subgoals (both success and failure) ⇒ fix using caching of previous results
> Widely used (without improvements!) for **logic programming**

#### الشرح المبسّط:

| الخاصية | التفاصيل |
| --- | --- |
| **نوع البحث** | `Depth-First` — المساحة خطية في حجم الإثبات |
| **الاكتمال** | ❌ ناقص بسبب الحلقات اللانهائية |
| **حل الحلقات** | مقارنة الهدف الحالي مع كل الأهداف في المكدس |
| **التكرار** | أهداف فرعية متكررة تُضيّع الوقت |
| **حل التكرار** | `Caching` (تخزين مؤقت للنتائج) |
| **الاستخدام** | `Logic Programming` (خاصة `Prolog`) |

---

### 18. Logic Programming — البرمجة المنطقية

#### النص الأصلي يقول:
> Sound bite: computation as inference on logical KBs
> Logic programming: 1. Identify problem 2. Assemble information 3. Tea break 4. Encode information in KB 5. Encode problem instance as facts 6. Ask queries 7. Find false facts
> Should be easier to debug Capital(NewYork, US) than x := x + 2 !

#### الشرح المبسّط:
**البرمجة المنطقية** = بدلاً من برمجة **كيف** تحل المشكلة، تُخبر الحاسوب **ماذا** تعرف عن المشكلة ثم يستنتج الحل.

#### ⚖️ المقايضة: البرمجة المنطقية مقابل البرمجة العادية

| | البرمجة المنطقية | البرمجة العادية |
| --- | --- | --- |
| التفكير | تصف المعرفة | تبرمج الحل |
| التصحيح | `Capital(NewYork,US)` أوضح | `x := x+2` أصعب فهمه |
| التوقف | غير مضمون | مضمون في الغالب |
| متى تختاره | مسائل رمزية/منطقية | خوارزميات عددية |

---

### 19. Prolog Systems — أنظمة Prolog

#### النص الأصلي يقول:
> Basis: backward chaining with Horn clauses + bells & whistles
> Program = set of clauses = head :- literal₁, ... literalₙ
> criminal(X) :- american(X), weapon(Y), sells(X,Y,Z), hostile(Z).
> Efficient unification by open coding | Depth-first, left-to-right backward chaining
> Closed-world assumption ("negation as failure")
> e.g., alive(X) :- not dead(X). alive(joe) succeeds if dead(joe) fails

#### الشرح المبسّط:
`Prolog` = نظام برمجة منطقية يطبّق `Backward Chaining` مع `Horn Clauses`.

**مميزات `Prolog`:**
- `Open Coding` للـ `Unification` → كفاءة عالية
- ربط مباشر للجُمل المتطابقة (`Direct Linking`)
- `Closed World Assumption`: ما لم يُثبت صحيح → خاطئ (`Negation as Failure`)
- محمولات مدمجة للحساب: `X is Y*Z+3`

**مثال `Prolog` لـ `DFS`:**
```text
dfs(X) :- goal(X).                    // Base: X is goal
dfs(X) :- successor(X,S), dfs(S).    // Recursive: try successors
```

**مثال `append`:**
```text
append([], Y, Y).
append([X|L], Y, [X|Z]) :- append(L, Y, Z).
```
استعلام: `append(A, B, [1,2])` → يُعيد:
- `A=[], B=[1,2]`
- `A=[1], B=[2]`
- `A=[1,2], B=[]`

---

### 20. Resolution — الدحض في FOL

#### النص الأصلي يقول:
> Full first-order version:
> $$\frac{\ell_1 \vee \cdots \vee \ell_k, \quad m_1 \vee \cdots \vee m_n}{(\ell_1 \vee \cdots \vee \ell_{i-1} \vee \ell_{i+1} \vee \cdots \vee \ell_k \vee m_1 \vee \cdots \vee m_{j-1} \vee m_{j+1} \vee \cdots \vee m_n)\theta}$$
> where UNIFY(ℓᵢ, ¬mⱼ) = θ
> Apply resolution steps to CNF(KB ∧ ¬α); complete for FOL

#### الشرح المبسّط:
`Resolution` في `FOL` = مزج بنودَيْن من بندَيْن (`clauses`) بعد توحيد (`Unify`) حرف ومنفيّه.

**المثال من المحاضرة:**
- `¬Rich(x) ∨ Unhappy(x)`
- `Rich(Ken)`
- الحل: `UNIFY(Rich(x), Rich(Ken))` → `θ = {x/Ken}`
- النتيجة: `Unhappy(Ken)`

**طريقة الإثبات بالدحض:**
1. أضف نفي الهدف: `KB ∧ ¬α`
2. حوّل إلى `CNF` (`Conjunctive Normal Form`)
3. طبّق `Resolution` حتى تصل للجملة الفارغة `□`
4. إذا وصلت `□` → تناقض → `α` مثبتة ✅

#### 📐 المعادلة: Resolution Rule in FOL

$$\frac{\ell_1 \vee \cdots \vee \ell_k \quad\quad m_1 \vee \cdots \vee m_n}{(\ell_1 \vee \cdots \vee \hat{\ell}_i \vee \cdots \vee \ell_k \vee m_1 \vee \cdots \vee \hat{m}_j \vee \cdots \vee m_n)\theta}$$

$$\text{where} \quad \text{UNIFY}(\ell_i, \neg m_j) = \theta$$

**الشرح:**
- $\ell_i$ : حرف في البند الأول
- $m_j$ : حرف في البند الثاني
- $\neg m_j$ : منفيّ $m_j$
- $\theta$ : التعيين الذي يوحّد $\ell_i$ مع $\neg m_j$
- $\hat{\ell}_i$ : الحرف المحذوف من البند الأول
- النتيجة: دمج البندين بحذف الحرف وتوأمه المنفي

---

### 21. Conversion to CNF — التحويل إلى الصيغة الطبيعية التعاملية

#### النص الأصلي يقول:
> Everyone who loves all animals is loved by someone:
> ∀x [∀y Animal(y) ⇒ Loves(x,y)] ⇒ [∃y Loves(y,x)]
> Steps: 1. Eliminate biconditionals and implications 2. Move ¬ inwards 3. Standardize variables 4. Skolemize 5. Drop universal quantifiers 6. Distribute ∧ over ∨

#### الشرح المبسّط:
لتحويل أي جملة `FOL` إلى `CNF` نتبع 6 خطوات:

#### ⚙️ الخطوات / الخوارزمية: Conversion to CNF

#### ما هدف هذه العملية؟
> تحويل جُمَل `FOL` إلى `CNF` لتمكين تطبيق خوارزمية `Resolution`.

```algorithm
1 | حذف ⟺ و ⇒ | Equivalence/Implication Elimination | α⇒β يصبح ¬α∨β
2 | نقل ¬ إلى الداخل | De Morgan + Quantifier Duality | ¬∀x,p ≡ ∃x ¬p | ¬∃x,p ≡ ∀x ¬p
3 | توحيد المتحولات | Standardize Apart | كل كمّ يستخدم متحولاً مختلفاً
4 | Skolemize | Skolem Function/Constant | ∃y داخل ∀x → دالة F(x)
5 | حذف ∀ | Drop Universal Quantifiers | المتحولات المتبقية كلها كلية ضمناً
6 | توزيع ∧ على ∨ | Distribution | (A∧B)∨C → (A∨C)∧(B∨C)
```

#### نقاط التنفيذ:
- `Skolemize`: إذا كان `∃y` تحت `∀x`، استبدل `y` بـ `F(x)` (دالة سكولم من `x`)
- إذا لم يكن `∃y` تحت أي `∀` → استبدل بثابت سكولم (`Skolem constant`)
- بعد الخطوة 6: كل جملة في صيغة `(L₁∨L₂∨...)` أي `clause`

**مثال تفصيلي من المحاضرة:**
- الأصل: `∀x [∀y Animal(y) ⇒ Loves(x,y)] ⇒ [∃y Loves(y,x)]`
- بعد خطوة 1: `∀x [¬∀y ¬Animal(y) ∨ Loves(x,y)] ∨ [∃y Loves(y,x)]`
- بعد خطوة 2: `∀x [∃y ¬(¬Animal(y) ∨ Loves(x,y))] ∨ [∃y Loves(y,x)]` → ... → `∀x [∃y Animal(y) ∧ ¬Loves(x,y)] ∨ [∃z Loves(z,x)]`
- بعد خطوة 3: `∀x [∃y Animal(y) ∧ ¬Loves(x,y)] ∨ [∃z Loves(z,x)]`
- بعد **Skolemize** (y→F(x)، z→G(x)): `∀x [Animal(F(x)) ∧ ¬Loves(x,F(x))] ∨ Loves(G(x),x)`
- بعد خطوة 5 (حذف ∀): `[Animal(F(x)) ∧ ¬Loves(x,F(x))] ∨ Loves(G(x),x)`
- بعد خطوة 6: `[Animal(F(x)) ∨ Loves(G(x),x)] ∧ [¬Loves(x,F(x)) ∨ Loves(G(x),x)]`

النتيجة: بندان (`clauses`) جاهزان لـ `Resolution`.

---

### 22. Resolution Proof: Definite Clauses — إثبات بالدحض

#### النص الأصلي يقول:
> [مخطط Resolution الكامل لإثبات Criminal(West)]

#### الشرح المبسّط:
المخطط يبين كيف يُستخدم `Resolution` لإثبات `Criminal(West)` بطريقة الدحض:

**الخطوات الكبرى:**
1. أضف نفي الهدف: `¬Criminal(West)`
2. حوّل `KB ∧ ¬Criminal(West)` إلى `CNF`
3. طبّق `Resolution` بين بنود `CNF` حتى تصل `□` (جملة فارغة)

#### 🔍 تتبع التنفيذ: Resolution Proof

**المدخل:** `¬Criminal(West)` + قواعد `KB` بصيغة `CNF`

| الخطوة | البند الأول | البند الثاني | الناتج |
| --- | --- | --- | --- |
| 1 | `¬American(x)∨¬Weapon(y)∨¬Sells(x,y,z)∨¬Hostile(z)∨Criminal(x)` | `¬Criminal(West)` | `¬American(West)∨¬Weapon(y)∨¬Sells(West,y,z)∨¬Hostile(z)` |
| 2 | (الناتج السابق) | `American(West)` | `¬Weapon(y)∨¬Sells(West,y,z)∨¬Hostile(z)` |
| 3 | (السابق) | `¬Missile(x)∨Weapon(x)` | `¬Missile(y)∨¬Sells(West,y,z)∨¬Hostile(z)` |
| 4 | (السابق) | `Missile(M₁)` | `¬Sells(West,M₁,z)∨¬Hostile(z)` |
| 5 | (السابق) | `¬Missile(x)∨¬Owns(Nono,x)∨Sells(West,x,Nono)` | `¬Missile(M₁)∨¬Owns(Nono,M₁)∨¬Hostile(Nono)` |
| 6 | (السابق) | `Missile(M₁)` | `¬Owns(Nono,M₁)∨¬Hostile(Nono)` |
| 7 | (السابق) | `Owns(Nono,M₁)` | `¬Hostile(Nono)` |
| 8 | `¬Enemy(x,America)∨Hostile(x)` | `¬Hostile(Nono)` | `¬Enemy(Nono,America)` |
| 9 | `¬Enemy(Nono,America)` | `Enemy(Nono,America)` | `□` (جملة فارغة) ✅ |

**النتيجة:** تناقض → `Criminal(West)` مثبتة.

---

## الجزء الثاني: ملخص منظم

### أهم التعاريف والمفاهيم

| المصطلح | التعريف | مثال/ملاحظة |
| --- | --- | --- |
| `Universal Instantiation (UI)` | استبدال المتحول الكلي بـ `ground term` | `∀x P(x)` → `P(John)` |
| `Existential Instantiation (EI)` | استبدال المتحول الوجودي بثابت `Skolem` جديد | `∃x P(x)` → `P(C₁)` |
| `Skolem Constant` | ثابت جديد لم يظهر في `KB` يُستخدم في `EI` | `C₁`, `M₁` |
| `Skolem Function` | دالة تُستبدل بالمتحول الوجودي إذا كان داخل `∀` | `F(x)` |
| `Propositionalization` | تحويل `FOL KB` إلى منطق قضوي بتطبيق `UI` | مفيد لـ `KB` صغير |
| `Ground Term` | تعبير لا يحتوي متحولات | `John`، `Father(John)` |
| `Unification` | إيجاد تعيين `θ` يجعل تعبيرَين متطابقَيْن | `UNIFY(P(x), P(John)) = {x/John}` |
| `Standardize Apart` | إعادة تسمية متحولات جملة لتجنب التعارض | `x` → `z₁₇` |
| `Most General Unifier (MGU)` | التعيين الأكثر عمومية (الأقل قيوداً) | (شرح زيادة للفهم) |
| `Generalized Modus Ponens (GMP)` | `Modus Ponens` بمتحولات عبر `Unification` | `King(John)+King(x)∧Greedy(x)⇒Evil(x)` → `Evil(John)` |
| `Definite Clause` | بند يحتوي بالضبط حرفاً إيجابياً واحداً | `¬A∨¬B∨C` ≡ `A∧B⇒C` |
| `Forward Chaining` | الاستنتاج من الحقائق نحو الهدف | `FOL-FC-ASK` |
| `Backward Chaining` | الاستنتاج من الهدف نحو الحقائق | `FOL-BC-ASK` |
| `Datalog` | `FOL Definite Clauses` بدون دوال | يتوقف مضموناً |
| `Resolution` | قاعدة استنتاج كاملة لـ `CNF` | يُثبت بالتناقض |
| `CNF` | صيغة طبيعية تعاملية: `AND` من `OR`-بنود | مطلوب لـ `Resolution` |
| `Semidecidable` | يُثبت إذا كانت الجملة معلولة، لا يتوقف إذا لم تكن | `FOL Entailment` |

---

### المكونات الرئيسية (مرجع سريع)

| الأداة | الوظيفة | ملاحظة |
| --- | --- | --- |
| `SUBST(θ, α)` | تطبيق تعيين `θ` على جملة `α` | `SUBST({x/John}, P(x)) = P(John)` |
| `UNIFY(α, β)` | إيجاد `θ` بحيث `αθ = βθ` | يُعيد `fail` إذا مستحيل |
| `STANDARDIZE-APART(r)` | إعادة تسمية متحولات قاعدة | يمنع تعارض المتحولات |
| `COMPOSE(θ₁, θ₂)` | تركيب تعيينَيْن | `COMPOSE({x/y},{y/John}) = {x/John,y/John}` |
| `FOL-FC-ASK(KB, α)` | التسلسل الأمامي | يُعيد `θ` أو `false` |
| `FOL-BC-ASK(KB, goals, θ)` | التسلسل الخلفي | يُعيد مجموعة تعيينات |

---

### جداول مقارنات سريعة

#### Forward Chaining مقابل Backward Chaining

| المعيار | `Forward Chaining` | `Backward Chaining` |
| --- | --- | --- |
| الاتجاه | الحقائق → الهدف | الهدف → الحقائق |
| نوع البحث | بحث أمامي شامل | `Depth-First` |
| الفضاء | قد يكون كبيراً | خطي في حجم الإثبات |
| الاكتمال | ✅ (مع `Datalog`) | ❌ (حلقات لانهائية) |
| الاستخدام | قواعد بيانات استنتاجية | `Prolog`، `Logic Programming` |
| الكفاءة | ينتج حقائق غير ذات صلة | يركّز على الهدف |

#### UI مقابل EI

| المعيار | `UI` | `EI` |
| --- | --- | --- |
| الكمّ | `∀` (كلي) | `∃` (وجودي) |
| التطبيق | مرات غير محدودة | مرة واحدة فقط |
| التكافؤ | `KB` الجديد مكافئ للأصلي | ليس مكافئاً (لكن متوافق) |
| الأثر | إضافة جُمَل | استبدال الجملة الوجودية |

#### GMP مقابل Resolution

| المعيار | `GMP` | `Resolution` |
| --- | --- | --- |
| نوع الجُمَل | `Definite Clauses` فقط | أي `CNF Clauses` |
| الاكتمال | ✅ لـ `Definite Clauses` | ✅ لـ `FOL` كاملاً |
| الاتجاه | أمامي/خلفي | بالدحض (`Refutation`) |
| التعقيد | أبسط | أعقد (يحتاج `CNF`) |

---

### قاموس المصطلحات

| الفئة | المصطلحات |
| --- | --- |
| الاستنتاج الأساسي | `UI`، `EI`، `Skolem Constant`، `Skolem Function`، `SUBST` |
| التوحيد | `Unification`، `Substitution`، `MGU`، `Standardize Apart`، `COMPOSE` |
| الاستنتاج بالبناء | `GMP`، `Definite Clause`، `Forward Chaining`، `Backward Chaining` |
| التحويل | `Propositionalization`، `CNF`، `Skolemization` |
| الدحض | `Resolution`، `Refutation`، `Empty Clause □` |
| الخصائص | `Soundness`، `Completeness`، `Semidecidable`، `Datalog` |
| البرمجة المنطقية | `Prolog`، `Horn Clause`، `Negation as Failure`، `Closed World Assumption` |

---

### أبرز النقاط الذهبية

1. `UI` يحافظ على التكافؤ المنطقي — يمكن تطبيقه بلا حدود
2. `EI` يُنتج `KB` غير مكافئ للأصلي لكن متوافق في الإشباع
3. `Unification` هو قلب كل الخوارزميات — بدونه لا استنتاج في `FOL`
4. `Propositionalization` صحيح لكن غير عملي مع `function symbols` (انفجار لانهائي)
5. `GMP` يدمج `Unification` مع `Modus Ponens` — يعمل فقط على `Definite Clauses`
6. `Forward Chaining`: كامل لـ `Datalog`، قد لا يتوقف مع `function symbols`
7. `Backward Chaining`: موجّه للهدف — يركّز جهده على ما هو ذو صلة
8. `Resolution` كاملة لـ `FOL` بالكامل — الأقوى لكن تحتاج `CNF`
9. مطابقة المقدمات التعاملية (`conjunctive premise matching`) مشكلة `NP-hard`
10. الاستنتاج في `FOL` **نصف قابل للقرار** (`semidecidable`) — حكم أساسي (Turing/Church 1936)

---

### الأخطاء الشائعة عند الطلاب ⚠️

| الخطأ | التصحيح |
| --- | --- |
| استخدام `Skolem constant` موجود في `KB` | `Skolem constant` يجب أن يكون **جديداً كلياً** |
| تطبيق `EI` أكثر من مرة على نفس الجملة | `EI` يُطبَّق **مرة واحدة** فقط |
| الخلط بين `UI` (يضيف) و`EI` (يستبدل) | `UI` يبقي الجملة الأصلية، `EI` يستبدلها |
| نسيان `Standardize Apart` قبل `Unification` | دائماً أعد تسمية المتحولات قبل التوحيد |
| الاعتقاد بأن `Forward Chaining` يتوقف دائماً | لا يتوقف إذا كان الهدف غير معلول مع `function symbols` |
| الاعتقاد بأن `Backward Chaining` كامل | ناقص بسبب الحلقات اللانهائية |
| تطبيق `Resolution` على جُمَل غير `CNF` | يجب تحويل الجُمَل إلى `CNF` أولاً |
| الخلط بين `Skolem Function` و`Skolem Constant` | `Constant` إذا لم يكن `∃` داخل `∀`؛ `Function` إذا كان داخله |

---

### خطوات وإجراءات المحاضرة

#### ⚙️ الخطوات / الخوارزمية: Universal Instantiation (UI)

#### ما هدفها؟
> تحويل جملة كلية إلى حقيقة محددة باستبدال المتحول بـ `ground term`.

```algorithm
1 | حدد الجملة | ∀v α في KB | المتحول v والجسم α
2 | اختر ground term | g (ثابت أو تعبير بلا متحولات) | يمكن أي عدد من الاختيارات
3 | طبّق SUBST | SUBST({v/g}, α) | استبدل كل v بـ g في α
4 | أضف الناتج | أضف إلى KB | KB موسَّع مكافئ منطقياً للأصل
```

#### نقاط التنفيذ:
- يمكن تطبيق `UI` مرات غير محدودة مع قيم مختلفة لـ `g`
- `KB` الجديد **مكافئ** منطقياً للأصلي

---

#### ⚙️ الخطوات / الخوارزمية: Existential Instantiation (EI)

#### ما هدفها؟
> إزالة الكمّ الوجودي باستبدال المتحول بثابت سكولم جديد.

```algorithm
1 | حدد الجملة | ∃v α في KB | المتحول v والجسم α
2 | أنشئ Skolem constant | k — ثابت لم يظهر في KB أبداً | مثل C₁ أو k_new
3 | طبّق SUBST | SUBST({v/k}, α) | استبدل كل v بـ k في α
4 | استبدل الجملة | احذف ∃v α وأضف الناتج | لا يُحفظ المستبدَل منه
```

#### نقاط التنفيذ:
- `EI` يُطبَّق **مرة واحدة فقط** على كل جملة وجودية
- `KB` الجديد **ليس مكافئاً** للأصلي لكنه `satisfiable iff` الأصلي كذلك

---

#### ⚙️ الخطوات / الخوارزمية: Unification

#### ما هدفها؟
> إيجاد تعيين يجعل تعبيرَيْن متطابقَيْن.

```algorithm
1 | قارن رأسَيْ التعبيرين | Predicate / Functor | إذا مختلفان → FAIL
2 | قارن عدد الوسائط | Arity | إذا مختلفان → FAIL
3 | لكل زوج (tᵢ, sᵢ) | Recursive Unification | وحّد كل وسيط مع نظيره
4 | إذا تعبير = متحول | Occur Check (اختياري) | تأكد عدم وجود دورة (x = F(x) → FAIL)
5 | طبّق التعيين التراكمي | COMPOSE | ادمج التعيينات الجديدة مع القديمة
6 | أعد التعيين الكلي | MGU | المُوحِّد الأكثر عمومية
```

#### نقاط التنفيذ:
- `Standardize Apart` **قبل** التوحيد دائماً
- `MGU` هو الأقل تقييداً من بين كل المُوحِّدات الممكنة

---

#### ⚙️ الخطوات / الخوارزمية: Conversion to CNF

#### ما هدفها؟
> تحويل جمل `FOL` إلى `CNF` لتطبيق `Resolution`.

```algorithm
1 | حذف ⟺ | α⟺β → (α⇒β)∧(β⇒α) | التكافؤ المزدوج
2 | حذف ⇒ | α⇒β → ¬α∨β | المادة الشرطية
3 | نقل ¬ للداخل | De Morgan + Quantifier Duality | ¬∀x P ≡ ∃x ¬P
4 | توحيد المتحولات | Standardize Apart | ∀x (∀x P(x)) → ∀x (∀y P(y))
5 | Skolemize | استبدل ∃ بدالة/ثابت سكولم | ∃y → F(x) إذا داخل ∀x
6 | حذف ∀ | الكميات الكلية ضمنية | جميع المتحولات المتبقية كلية
7 | توزيع ∧ على ∨ | Distribution Law | (A∧B)∨C → (A∨C)∧(B∨C)
```

---

### أنماط الأكواد والبنى المتكررة

| النمط | البنية الأساسية | متى تستخدمه |
| --- | --- | --- |
| `Definite Clause` | `p₁ ∧ ... ∧ pₙ ⇒ q` (قاعدة) أو `q` (حقيقة) | مع `GMP`، `Forward/Backward Chaining` |
| `Resolution Step` | `(A ∨ ¬B) + (B ∨ C) → (A ∨ C)` | مع `CNF` |
| `Skolem in ∀` | `∃y داخل ∀x` → `F(x)` (دالة) | في `Skolemization` |
| `Skolem outside ∀` | `∃y` بدون `∀` حوله → `C₁` (ثابت) | في `EI` |

---

### أنماط التعامل والسلوك

| السيناريو | التعامل الصحيح | لماذا؟ |
| --- | --- | --- |
| الهدف ذو صلة بعدة حقائق | `Backward Chaining` | يركّز الجهد على الهدف |
| `KB` كبير وعلاقات معقدة | `Forward Chaining` | يبني معرفة تراكمية |
| أي جُمَل `FOL` (بما فيها سالبة) | `Resolution` | الأشمل والأكمل |
| `KB` صغير بلا دوال | `Propositionalization` | بسيط ومضمون |
| أهداف متكررة | `Backward Chaining + Caching` | يتجنب الحساب المكرر |

---

## الجزء الثالث: أسئلة اختيار من متعدد (MCQ)

> **18 سؤالاً** — مستوى: medium/hard. التوزيع: مقارنات 25% | pseudocode/تتبع 35% | تطبيق 25% | تتبع خوارزمية 15%.

---

### السؤال 1 (medium)
ما الفرق الجوهري بين `UI` و`EI` في تأثيرهما على قاعدة المعرفة `KB`؟

أ) `UI` يستبدل الجملة الأصلية، `EI` يضيف جُملاً جديدة
ب) `UI` يضيف جُملاً جديدة مع الحفاظ على التكافؤ، `EI` يستبدل الجملة الوجودية مع فقدان التكافؤ
ج) كلاهما يضيف جُملاً جديدة وكلاهما يحافظ على التكافؤ
د) `UI` يُطبَّق مرة واحدة فقط، `EI` يُطبَّق مرات غير محدودة

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** `UI` يُضاف إلى `KB` (`add`) والـ `KB` الجديد مكافئ منطقياً للأصلي. `EI` يُحلّ محل (`replace`) الجملة الوجودية وينتج `KB` غير مكافئ لكنه متوافق في الإشباع.
- **أ خاطئة:** العكس هو الصحيح.
- **ج خاطئة:** `EI` يفقد التكافؤ المنطقي.
- **د خاطئة:** `UI` يُطبَّق مرات غير محدودة، `EI` يُطبَّق مرة واحدة.

---

### السؤال 2 (hard)
عند تطبيق `UNIFY(Knows(John, x), Knows(y, Mother(y)))` ما هو `θ`؟

أ) `{x/Mother(y), y/John}`
ب) `{y/John, x/Mother(John)}`
ج) `fail` لأن `y` تظهر مرتين
د) `{x/y, y/John, x/Mother(John)}`

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** من `John = y` نستنتج `y/John`؛ ثم `x = Mother(y) = Mother(John)` → `x/Mother(John)`. بالتحقق: `Knows(John, Mother(John))` = `Knows(John, Mother(John))` ✅
- **أ خاطئة:** التعيين غير مكتمل — `y` لم تُحسم بقيمة نهائية.
- **ج خاطئة:** ظهور `y` مرتين لا يسبب فشلاً — المشكلة فقط إذا اقتضى `y = F(y)` (دورة).
- **د خاطئة:** `x` لا يمكن أن يظهر مرتين في `θ` بقيم مختلفة.

---

### السؤال 3 (medium)
ما خاصية `Forward Chaining` التي تجعله مناسباً لـ `Datalog`؟

أ) يضمن الوصول للهدف في `O(1)`
ب) يتوقف بعد عدد منتهٍ من التكرارات (≤ p·nᵏ) مع ضمان الاكتمال
ج) لا يستخدم `Unification` أبداً
د) يتوقف دائماً حتى مع `function symbols`

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** `Datalog` = `FOL Definite Clauses` بدون دوال. بدون دوال `ground terms` منتهية (`p·nᵏ`) → يتوقف مضموناً مع اكتمال.
- **أ خاطئة:** `O(1)` للاسترجاع بالفهرسة، ليس للاكتمال.
- **ج خاطئة:** `Forward Chaining` يستخدم `Unification` عبر `GMP`.
- **د خاطئة:** مع `function symbols`، `ground terms` لا نهائية → قد لا يتوقف.

---

### السؤال 4 (hard)
في `FOL-BC-ASK`، ماذا يحدث عند استدعاء `COMPOSE(θ', θ)`؟

أ) يُحذف `θ'` ويُبقي `θ` فقط
ب) يُدمج تعيين `θ'` الجديد مع `θ` الحالي لتكوين تعيين مركّب
ج) يتحقق من صحة `θ'` ثم يُرجعه إذا كان غير `fail`
د) يطبّق `θ'` على الهدف ثم يُرجع الناتج

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** `COMPOSE(θ', θ)` يدمج التعيينَيْن — يطبّق `θ'` على قيم `θ` ثم يضيف الروابط الجديدة.
- **أ خاطئة:** لا نحذف أياً منهما — الدمج تراكمي.
- **ج خاطئة:** التحقق يتم بـ `UNIFY` وليس `COMPOSE`.
- **د خاطئة:** `COMPOSE` لا يتعامل مع الأهداف مباشرة.

---

### السيناريو 1: تتبع Backward Chaining

**السيناريو:**
لدينا `KB` التالي:
```
Q(a)
P(x) ⇒ R(x)
Q(x) ⇒ P(x)
R(x) ⇒ S(x)
```
الهدف: `S(a)`

---

### السؤال 5 (hard) — السيناريو 1
ما أول هدف فرعي يُنشأ عند `Backward Chaining` من `S(a)`؟

أ) `Q(a)`
ب) `P(a)`
ج) `R(a)`
د) `S(x)`

**الإجابة الصحيحة: ج**
**التعليل:**
- **ج صحيحة:** القاعدة الوحيدة التي ينتج عن رأسها `S(x)` هي `R(x)⇒S(x)`. بتوحيد `S(a)` مع `S(x)`: `θ={x/a}` → الهدف الجديد: `R(a)`.
- **أ خاطئة:** `Q(a)` يأتي لاحقاً في السلسلة.
- **ب خاطئة:** `P(a)` أيضاً لاحق.
- **د خاطئة:** `S(x)` هو رأس القاعدة، ليس هدفاً فرعياً.

---

### السؤال 6 (hard) — السيناريو 1
ما التسلسل الكامل لتوسيع الأهداف حتى الإثبات؟

أ) `S(a) → R(a) → P(a) → Q(a)` ✓ (حقيقة)
ب) `S(a) → P(a) → Q(a)` ✓ (حقيقة)
ج) `S(a) → Q(a)` ✓ (حقيقة مباشرة)
د) `S(a) → R(a) → Q(a)` ✓ (حقيقة)

**الإجابة الصحيحة: أ**
**التعليل:**
- **أ صحيحة:** `S(a)` → قاعدة `R⇒S` → `R(a)` → قاعدة `P⇒R` → `P(a)` → قاعدة `Q⇒P` → `Q(a)` → حقيقة ✅
- **ب خاطئة:** تخطي `R` — لا توجد قاعدة مباشرة `P⇒S`.
- **ج خاطئة:** لا توجد قاعدة مباشرة `Q⇒S`.
- **د خاطئة:** لا توجد قاعدة مباشرة `Q⇒R`.

---

### السؤال 7 (medium)
لماذا يُعدّ الاستنتاج في `FOL` **نصف قابل للقرار** (`semidecidable`)؟

أ) لأن `FOL KB` يمكن أن يكون لانهائياً
ب) لأننا نستطيع إثبات الجُمَل المعلولة في وقت منتهٍ لكن لا يمكننا إثبات عدم الاستلزام في وقت منتهٍ
ج) لأن `Resolution` لا يعمل على `FOL`
د) لأن `Unification` قد يفشل دائماً

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** من مبرهنة هربراند + توشيرش + تورنج: إذا كانت `α` معلولة → إجراء `Propositionalization` سيجدها في `depth` منتهٍ. أما إذا لم تكن معلولة → الحلقة لا تتوقف أبداً.
- **أ خاطئة:** `FOL KB` قد يكون منتهياً.
- **ج خاطئة:** `Resolution` كاملة لـ `FOL`.
- **د خاطئة:** `Unification` خوارزمية محددة تعطي إجابة.

---

### السؤال 8 (medium)
ما هو `Skolem Function` ومتى يُستخدم بدلاً من `Skolem Constant`؟

أ) `Skolem Function` تُستخدم دائماً بديلاً عن `Skolem Constant`
ب) `Skolem Constant` تُستخدم عندما يكون `∃v` داخل `∀x`، و`Skolem Function` عندما يكون `∃v` وحده
ج) `Skolem Function F(x)` تُستخدم عندما يكون `∃v` داخل نطاق `∀x`، لأن الوجود يعتمد على `x`
د) كلاهما متكافئان ويمكن استخدام أي منهما

**الإجابة الصحيحة: ج**
**التعليل:**
- **ج صحيحة:** إذا كان `∃y` داخل `∀x`، فـ `y` قد تعتمد على `x` — لذا نستخدم `F(x)`. إذا لم يكن `∃y` داخل أي `∀`، نستخدم ثابتاً `C₁`.
- **أ خاطئة:** الاختيار يعتمد على السياق.
- **ب خاطئة:** العلاقة معكوسة — `Function` عند وجود `∀` خارجي.
- **د خاطئة:** ليسا متكافئَيْن — استخدام الخاطئ منهما ينتج نتيجة خاطئة.

---

### السيناريو 2: تصحيح pseudocode Forward Chaining

**السيناريو:**
```text
function BROKEN-FC-ASK(KB, α)
  repeat
    new ← {}
    for each rule (p1∧...∧pn⇒q) in KB do
      for each θ matching premises in KB do
        q' ← SUBST(θ, q)
        add q' to KB        // BUG LINE
        if UNIFY(q', α) ≠ fail then return UNIFY(q', α)
  until new is empty
  return false
```

---

### السؤال 9 (hard) — السيناريو 2
ما الخطأ الرئيسي في الكود؟

أ) يجب استدعاء `STANDARDIZE-APART` قبل الحلقة
ب) يُضاف `q'` مباشرة إلى `KB` بدلاً من `new` — يُفسد شرط التوقف ويُعيد معالجة نفس الحقائق
ج) يجب استخدام `SUBST(θ, α)` بدلاً من `SUBST(θ, q)`
د) شرط `UNIFY(q', α) ≠ fail` يجب أن يكون قبل الإضافة

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** الإضافة المباشرة لـ `KB` تُفسد منطق «الدورة» — `new` يُستخدم لتجميع الحقائق الجديدة وفحص شرط التوقف (`until new is empty`). الإضافة المباشرة تعني أن `new` دائماً فارغ → توقف مبكر، أو حلقة لانهائية.
- **أ خاطئة:** `STANDARDIZE-APART` غائب لكنه ليس الخطأ الرئيسي.
- **ج خاطئة:** `SUBST(θ, q)` صحيح — نريد الاستنتاج `q` بعد التعيين.
- **د خاطئة:** ترتيب الفحص صحيح في المبدأ.

---

### السؤال 10 (hard)
ما مشكلة `Occur Check` في `Unification` ولماذا يُهمَل أحياناً؟

أ) يتسبب في فشل `Unification` الصحيح
ب) `Occur Check` يتحقق إذا كان متحول `x` يظهر في `F(x)` — منعاً لتعيين `{x/F(x)}` الذي يُنشئ بنية لانهائية؛ يُهمَل لأنه يُبطئ `Prolog` وهذه الحالات نادرة
ج) يمنع استخدام `Skolem Functions`
د) لا يؤثر على صحة النتيجة على الإطلاق

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** `UNIFY(x, F(x))` بدون `Occur Check` سيعيد `{x/F(x)}` — وهذا يعني `x = F(F(F(...)))` — بنية لانهائية. `Prolog` يُهمل `Occur Check` لأنه مكلف `O(n)` ونادر في التطبيق العملي.
- **أ خاطئة:** `Occur Check` يمنع التعيين الخاطئ، لا الصحيح.
- **ج خاطئة:** لا علاقة لـ `Occur Check` بـ `Skolem Functions`.
- **د خاطئة:** بدون `Occur Check`، قد تُعيد `Unification` تعيينات لانهائية خاطئة.

---

### السؤال 11 (medium)
ما الفرق بين `Definite Clause` و`Horn Clause`؟

أ) كلاهما نفس الشيء تماماً
ب) `Horn Clause` تسمح بصفر حروف إيجابية (بند خاطئ تماماً)، `Definite Clause` تشترط وجود حرف إيجابي واحد بالضبط
ج) `Definite Clause` أشمل من `Horn Clause`
د) `Horn Clause` تُستخدم في `Forward Chaining` فقط

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** `Horn Clause` = بند بحد أقصى حرف إيجابي واحد (قد يكون صفراً). `Definite Clause` = بند بحرف إيجابي واحد بالضبط (لا أقل ولا أكثر). `Definite Clauses ⊂ Horn Clauses`.
- **أ خاطئة:** بينهما فرق في حالة الصفر حروف إيجابية.
- **ج خاطئة:** العكس — `Horn` أشمل من `Definite`.
- **د خاطئة:** `Horn Clauses` يُستخدم في `Prolog` (خلفي).

---

### السؤال 12 (medium)
أي تعيين يُعدّ `Most General Unifier (MGU)` بين `P(x, f(y))` و`P(a, f(b))`؟

أ) `{x/a, y/b, x/a, y/b}` (تكرار)
ب) `{x/a, y/b}`
ج) `{x/a, y/b, z/c}` (إضافي)
د) `fail` لأن `f(y) ≠ f(b)`

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** `{x/a}` من مطابقة الوسيط الأول، `{y/b}` من مطابقة `f(y)` مع `f(b)`. البسيط والأعم.
- **أ خاطئة:** التكرار غير ضروري ويُعقّد التعيين.
- **ج خاطئة:** `z/c` غير مطلوب — `z` لم يظهر في التعبيرين.
- **د خاطئة:** `f(y)` و`f(b)` يتوحّدان بوضع `y/b`.

---

### السؤال 13 (hard)
في `Backward Chaining`، ما مشكلة **الحلقات اللانهائية** وكيف تُحل؟

أ) تنشأ بسبب `Unification` الفاشل — الحل: إعادة المحاولة مع قاعدة أخرى
ب) تنشأ حين يصبح الهدف الحالي هدفاً فرعياً لنفسه (مباشرة أو بشكل دوري) — الحل: فحص الهدف الحالي مقابل كل الأهداف في المكدس
ج) تنشأ فقط مع قواعد `Prolog` — الحل: استخدام `Cut (!)`
د) لا يمكن حلها إلا بتحويل المسألة إلى `Forward Chaining`

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** مثال: `P(x) :- Q(x), P(f(x))` — `Backward Chaining` قد يدخل حلقة توسيع `P` إلى ما لانهاية. الحل: فحص الهدف الجديد مقابل كل الأهداف في المكدس الحالي — إذا تطابق فتجنّبه.
- **أ خاطئة:** `Unification` الفاشل يسبب `backtracking` لا حلقة.
- **ج خاطئة:** الحلقات تحدث في `Backward Chaining` بشكل عام، `Cut` في `Prolog` حل مختلف.
- **د خاطئة:** `Caching` و`loop detection` يحلاّن المشكلة دون تغيير المنهجية.

---

### السؤال 14 (hard)
لماذا مطابقة المقدمات التعاملية (`conjunctive premise matching`) هي مشكلة `NP-hard`؟

أ) لأن `Unification` نفسه `NP-hard`
ب) لأنها تكافئ مشكلة إشباع القيود (`CSP`) التي تشمل `3SAT` كحالة خاصة
ج) لأن `KB` يمكن أن يكون لانهائياً
د) لأن `GMP` يحتاج تعيينات لكل المتحولات

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** كما يوضح مثال التلوين — إيجاد تعيين يُحقق مقدمة ذات `n` بند هو إيجاد حل `CSP` — و`CSP` يشمل `3SAT` → `NP-hard`.
- **أ خاطئة:** `Unification` لزوجَيْن `O(n)` — ليس `NP-hard`.
- **ج خاطئة:** حجم `KB` منفصل عن تعقيد المطابقة.
- **د خاطئة:** عدد المتحولات وحده لا يسبب `NP-hardness`.

---

### السؤال 15 (medium)
ما الهدف من `Standardize Apart` في خوارزميات `Chaining`؟

أ) تحسين سرعة `Unification`
ب) منع تعارض أسماء المتحولات عند توحيد مقدمات القواعد المختلفة مع الحقائق
ج) تحويل `KB` إلى `CNF`
د) التحقق من صحة `GMP`

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** إذا كانت قاعدتان تستخدمان نفس اسم المتحول `x`، يُنشأ خلط عند `Unification`. `Standardize Apart` يجعل كل نسخة من القاعدة لها متحولات فريدة (`x₁`، `x₂`، ...).
- **أ خاطئة:** الغرض منطقي لا أدائي.
- **ج خاطئة:** التحويل لـ `CNF` له خطوات منفصلة.
- **د خاطئة:** صحة `GMP` تُثبَت رياضياً وليس بـ `Standardize Apart`.

---

### السؤال 16 (hard)
ما الفرق بين `Closed World Assumption (CWA)` و`Open World Assumption (OWA)`؟

أ) `CWA` تفترض أن `KB` لا نهائية، `OWA` تفترضها منتهية
ب) في `CWA`: ما لا يُثبت صحته يُعتبر خاطئاً؛ في `OWA`: عدم وجود الدليل لا يعني الخطأ
ج) `CWA` مستخدمة في `FOL`، `OWA` في `Prolog`
د) كلتاهما تُعطيان نفس النتيجة دائماً

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** `Prolog` يستخدم `CWA` (`Negation as Failure`): `alive(joe)` يتحقق إذا فشل `dead(joe)`. في `FOL` العادي (`OWA`): عدم معرفة `dead(joe)` لا يعني نفيه.
- **أ خاطئة:** الفرق في معالجة الجهل، ليس في حجم `KB`.
- **ج خاطئة:** العكس — `Prolog` يستخدم `CWA`، `FOL` الخالص يستخدم `OWA`.
- **د خاطئة:** يختلفان في الاستنتاج من الغياب.

---

### السؤال 17 (hard)
عند تطبيق `Resolution` لإثبات `α` من `KB`، ماذا نضيف ولماذا؟

أ) نضيف `α` إلى `KB` ونتحقق من الاتساق
ب) نضيف `¬α` إلى `KB`، نحوّل كل شيء إلى `CNF`، ثم نطبّق `Resolution` حتى نصل `□`
ج) نضيف `α` بشكل مباشر ونتحقق من تولّده بـ `GMP`
د) نحوّل `KB` إلى `CNF` فقط دون إضافة أي شيء

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** منهجية الدحض (`Refutation`): إذا أردنا إثبات `α`، نفترض العكس `¬α`، وإذا أوصلنا `KB ∧ ¬α` إلى تناقض (`□`) فهذا يعني أن `¬α` مستحيل → `α` صحيحة.
- **أ خاطئة:** إضافة `α` لا تُثبتها.
- **ج خاطئة:** `GMP` أداة مختلفة.
- **د خاطئة:** بدون `¬α`، `Resolution` لا يعمل كإثبات.

---

### السؤال 18 (hard)
في `Prolog`، ما معنى `alive(X) :- not dead(X)` وما مشكلته المنطقية؟

أ) يعني أن `X` حي ⟺ غير ميت — وهو تعريف كامل ومثالي
ب) يعني أن `X` حي إذا **فشل إثبات** `dead(X)` — يُنتج استنتاجات خاطئة إذا كانت `KB` غير مكتملة
ج) يُطبّق `UI` على `not dead(X)` لجميع `X`
د) يحول `not dead(X)` إلى `¬dead(X)` في `FOL` مباشرة

**الإجابة الصحيحة: ب**
**التعليل:**
- **ب صحيحة:** `Negation as Failure` = `not dead(joe)` تنجح إذا فشل `Prolog` في إثبات `dead(joe)`. المشكلة: إذا لم نعرف إذا كان `joe` ميتاً أم لا (ليس في `KB`)، `Prolog` يعتبره حياً — وهذا `CWA` وليس `FOL` الحقيقي.
- **أ خاطئة:** `CWA` تُعطي نتائج خاطئة في `Open World` — لذا ليست مثالية.
- **ج خاطئة:** `Prolog` لا يطبّق `UI` هنا.
- **د خاطئة:** `not` في `Prolog` ≠ `¬` في `FOL` — فرق أساسي.

---

## الجزء الرابع: أسئلة تصحيح الخوارزميات (Pseudocode Debug)

> غطِّ أنواع الأخطاء: منطقية، سوء فهم، heuristic خاطئ، حلقة لا نهائية.

---

### سؤال تصحيح 1 — نوع: `logic`

**الكود التالي يحتوي خطأ:**
```text
// Existential Instantiation - BUGGY VERSION
function EI(KB, sentence):
  if sentence is of form ExistsV(v, alpha):
    k ← choose_any_constant_from(KB)   // BUG: using existing constant
    new_sentence ← SUBST({v/k}, alpha)
    KB.remove(sentence)
    KB.add(new_sentence)
    return KB
  return KB
```

**اكتشف الخطأ:** يستخدم ثابتاً **موجوداً** في `KB` بدلاً من إنشاء ثابت `Skolem` **جديد كلياً**.

**التصحيح:**
```text
// Existential Instantiation - CORRECT VERSION
function EI(KB, sentence):
  if sentence is of form ExistsV(v, alpha):
    k ← new_unique_constant()   // FIXED: create fresh Skolem constant never seen before
    new_sentence ← SUBST({v/k}, alpha)
    KB.remove(sentence)
    KB.add(new_sentence)
    return KB
  return KB
```

**شرح الحل:**
1. استخدام ثابت موجود يعني **مشاركة الهوية** — قد يُنتج `Crown(John)` بدلاً من `Crown(C₁)` مما يُضيف معلومة خاطئة
2. `Skolem constant` يجب أن يكون **جديداً تماماً** لا يُشارك هويته مع أي شيء معروف
3. القاعدة: «ثابت لا يظهر في أي مكان آخر في `KB`»

---

### سؤال تصحيح 2 — نوع: `infinite_loop`

**الكود التالي يحتوي خطأ:**
```text
// Backward Chaining - BUGGY VERSION
function BC-ASK(KB, goals, theta):
  if goals is empty: return {theta}
  q' ← SUBST(theta, FIRST(goals))
  for each rule (premises => head) in KB:
    theta' ← UNIFY(head, q')
    if theta' != fail:
      new_goals ← [premises | REST(goals)]  // BUG: no standardize apart
      answers ← BC-ASK(KB, new_goals, COMPOSE(theta', theta))
  return answers
```

**اكتشف الخطأ:** غياب `STANDARDIZE-APART` — متحولات القواعد المختلفة تتعارض مع بعضها.

**التصحيح:**
```text
// Backward Chaining - CORRECT VERSION
function BC-ASK(KB, goals, theta):
  if goals is empty: return {theta}
  q' ← SUBST(theta, FIRST(goals))
  for each rule r in KB:
    (p1,...,pn => q) ← STANDARDIZE-APART(r)   // FIXED: rename variables
    theta' ← UNIFY(q, q')
    if theta' != fail:
      new_goals ← [p1,...,pn | REST(goals)]
      answers ← BC-ASK(KB, new_goals, COMPOSE(theta', theta))
  return answers
```

**شرح الحل:**
1. بدون `STANDARDIZE-APART`، قاعدة `Parent(x,y) ⇒ Ancestor(x,y)` وقاعدة `Ancestor(x,z) ∧ Ancestor(z,y) ⇒ Ancestor(x,y)` تتشاركان `x`، `y` → تعارض
2. `STANDARDIZE-APART` يعيد تسمية كل نسخة باستخدام متحولات فريدة (`x₁`, `y₁`, `x₂`, `y₂`...)
3. يضمن عدم التداخل بين تعيينات القواعد المختلفة

---

### سؤال تصحيح 3 — نوع: `misconception`

**الكود التالي يحتوي خطأ:**
```text
// CNF Conversion - BUGGY Skolemization
// Input: ∀x ∃y Loves(x,y)
// Step: Skolemize ∃y
result ← SUBST({y/C1}, Loves(x,y))  // BUG: using Skolem constant instead of function
// Result: Loves(x, C1)   -- WRONG!
```

**اكتشف الخطأ:** استُخدم **ثابت سكولم** بينما `∃y` موجود **داخل نطاق** `∀x` — يجب استخدام **دالة سكولم** `F(x)`.

**التصحيح:**
```text
// CNF Conversion - CORRECT Skolemization
// Input: ∀x ∃y Loves(x,y)
// Step: Skolemize ∃y (which is inside ∀x scope)
result ← SUBST({y/F(x)}, Loves(x,y))  // FIXED: Skolem function F depending on x
// Result: Loves(x, F(x))   -- CORRECT
// Meaning: For each x, there exists SOME y (which may depend on x) that x loves
```

**شرح الحل:**
1. `∀x ∃y Loves(x,y)` يعني «لكل `x` يوجد `y` (قد يختلف حسب `x`) يحبه».
2. استخدام `C₁` يعني «يوجد شخص واحد يحبه **الكل**» — معنى أضيق وخاطئ.
3. القاعدة: إذا كان `∃` داخل `∀v₁,...,vₙ` → استخدم دالة سكولم `F(v₁,...,vₙ)`.

---

### سؤال تصحيح 4 — نوع: `logic`

**الكود التالي يحتوي خطأ:**
```text
// Forward Chaining - BUGGY termination check
function FC-ASK(KB, alpha):
  repeat
    new ← {}
    for each rule in KB:
      q' ← derive_conclusion(rule, KB)
      if q' not in KB:
        add q' to KB           // BUG: should add to 'new', not KB
        if UNIFY(q', alpha): return UNIFY(q', alpha)
  until KB has not changed    // BUG: this condition never activates correctly
  return false
```

**اكتشف الخطأ:** إضافة `q'` مباشرة لـ `KB` بدلاً من `new` يُفسد آلية الكشف عن ثبات `KB` (أي هل أُضيف شيء جديد في هذه الدورة).

**التصحيح:**
```text
// Forward Chaining - CORRECT VERSION
function FC-ASK(KB, alpha):
  repeat
    new ← {}                              // FIXED: separate accumulator
    for each rule in KB:
      q' ← derive_conclusion(rule, KB)
      if q' not in KB and q' not in new:  // FIXED: check both
        add q' to new                     // FIXED: add to new, not KB
        if UNIFY(q', alpha) != fail: return UNIFY(q', alpha)
    add new to KB                         // FIXED: batch update after full scan
  until new is empty                      // FIXED: correct termination
  return false
```

**شرح الحل:**
1. `new` يتتبع ما اشتُقّ في هذه الدورة — إذا كان فارغاً عند نهاية الدورة: لا جديد → توقّف
2. الإضافة المباشرة لـ `KB` تُغيّر الـ `KB` أثناء المسح → نتائج غير محددة
3. الإضافة الدفعية (`add new to KB`) بعد المسح الكامل تضمن الاتساق

---

### سؤال تصحيح 5 — نوع: `wrong_heuristic`

**الكود التالي يحتوي خطأ:**
```text
// Unification - BUGGY (missing variable check)
function UNIFY(x, y, theta):
  if theta = fail: return fail
  if x = y: return theta                    // Correct: identical terms
  if IS-VARIABLE(x): return UNIFY-VAR(x, y, theta)
  if IS-VARIABLE(y): return UNIFY-VAR(y, x, theta)
  if IS-COMPOUND(x) and IS-COMPOUND(y):
    return UNIFY(ARGS(x), ARGS(y),
                 UNIFY(OP(x), OP(y), theta))
  return fail

function UNIFY-VAR(var, x, theta):
  if {var/val} in theta: return UNIFY(val, x, theta)  // Apply existing binding
  if {x/val} in theta: return UNIFY(var, val, theta)  // Apply existing binding
  // BUG: missing Occur Check
  return EXTEND(theta, var, x)
```

**اكتشف الخطأ:** غياب `Occur Check` — يسمح بتعيين `{x/F(x)}` مما ينتج بنية لانهائية.

**التصحيح:**
```text
function UNIFY-VAR(var, x, theta):
  if {var/val} in theta: return UNIFY(val, x, theta)
  if {x/val} in theta: return UNIFY(var, val, theta)
  if OCCURS-IN(var, x):                   // FIXED: Occur Check
    return fail                           // Prevent x = F(x) infinite structure
  return EXTEND(theta, var, x)
```

**شرح الحل:**
1. `OCCURS-IN(x, F(x))` = هل يظهر `x` داخل `F(x)`؟ — نعم → `fail`
2. بدونه: `{x/F(x)}` → `x = F(F(F(...)))` → لانهاية
3. `Prolog` يُهمله للأداء — صحيح في الغالب لكنه خطأ نظري

---

### سؤال تصحيح 6 — نوع: `misconception`

**الكود التالي يحتوي خطأ:**
```text
// Resolution Step - BUGGY
function RESOLVE(c1, c2):
  // c1 = {L1, L2, ..., Lk}
  // c2 = {M1, M2, ..., Mn}
  for each Li in c1:
    for each Mj in c2:
      if Li = NOT(Mj):                   // BUG: exact syntactic equality only
        resolvent ← (c1 - {Li}) ∪ (c2 - {Mj})
        return resolvent
  return null
```

**اكتشف الخطأ:** المقارنة `Li = NOT(Mj)` تعمل فقط عند التطابق التام — تُخفق مع المتحولات (مثل `Rich(x)` و`¬Rich(Ken)`).

**التصحيح:**
```text
// Resolution Step - CORRECT (with Unification)
function RESOLVE(c1, c2):
  for each Li in c1:
    for each Mj in c2:
      theta ← UNIFY(Li, NOT(Mj))        // FIXED: use Unification
      if theta != fail:
        resolvent ← SUBST(theta, (c1 - {Li}) ∪ (c2 - {Mj}))  // FIXED: apply substitution
        return resolvent
  return null
```

**شرح الحل:**
1. `FOL Resolution` يعتمد على `Unification` — ليس مطابقة تامة
2. `UNIFY(Rich(x), NOT(NOT Rich(Ken)))` = `UNIFY(Rich(x), Rich(Ken))` = `{x/Ken}` → ينجح
3. يجب تطبيق `θ` على الـ `resolvent` لاستبدال المتحولات

---

## الجزء الرابع: تمارين تطبيقية

> **هذه تمارين إضافية من إعداد الدليل للتدريب** — ليست في المحاضرة الأصلية.

---

### تمرين 1: تطبيق UI وEI — `fill_gaps`

**السيناريو / المطلوب:**
لدينا الجُمَل التالية:
```
(A) ∀x ∀y Parent(x,y) ∧ Parent(y,z) ⇒ Grandparent(x,z)
(B) Parent(Tom, Bob)
(C) Parent(Bob, Ann)
(D) ∃x Happy(x) ∧ Rich(x)
```

**المطلوب:**
1. طبّق `UI` على `(A)` بوضع `x=Tom`, `y=Bob`, `z=Ann` واكتب الناتج
2. طبّق `EI` على `(D)` واكتب الناتج مع اسم الثابت المناسب
3. من (1) وحقيقتَي `(B)` و`(C)` طبّق `GMP` واستنتج الناتج

**نموذج الحل:**
1. `SUBST({x/Tom, y/Bob, z/Ann}, (A))` → `Parent(Tom,Bob) ∧ Parent(Bob,Ann) ⇒ Grandparent(Tom,Ann)`
2. `SUBST({x/C₁}, (D))` → `Happy(C₁) ∧ Rich(C₁)` (حيث `C₁` ثابت سكولم جديد)
3. `GMP`: المقدمات `Parent(Tom,Bob)` و`Parent(Bob,Ann)` تطابق `Parent(x,y)` و`Parent(y,z)` بـ `θ={x/Tom,y/Bob,z/Ann}` → الناتج: `Grandparent(Tom,Ann)` ✅

---

### تمرين 2: تطبيق Unification — `fill_gaps`

**السيناريو / المطلوب:**
أوجد `θ` لكل زوج أو قل `fail`:

| # | التعبير الأول | التعبير الثاني | θ |
| --- | --- | --- | --- |
| 1 | `Loves(x, Jane)` | `Loves(Bob, y)` | ؟ |
| 2 | `Father(x)` | `Father(Father(y))` | ؟ |
| 3 | `P(x, f(x))` | `P(a, f(a))` | ؟ |
| 4 | `Q(x, x)` | `Q(a, b)` (حيث `a ≠ b`) | ؟ |

**المطلوب:** أكمل العمود الأخير.

**نموذج الحل:**

| # | θ | الشرح |
| --- | --- | --- |
| 1 | `{x/Bob, y/Jane}` | `x=Bob` من الأول، `y=Jane` من الثاني |
| 2 | `{x/Father(y)}` | `Father(x) = Father(Father(y))` → `x=Father(y)` |
| 3 | `{x/a}` | `P(x,f(x))` مع `P(a,f(a))` → `x=a`، ثم `f(a)=f(a)` ✅ |
| 4 | `fail` | `x=a` من الوسيط الأول و`x=b` من الثاني تعارض (a≠b) |

---

### تمرين 3: تحويل إلى CNF — `code_fix`

**السيناريو / المطلوب:**
حوّل الجملة التالية إلى `CNF` خطوة بخطوة:
`∀x [Bird(x) ⇒ ∃y Wings(y) ∧ HasWings(x,y)]`

**المطلوب:** أكمل التحويل بالخطوات الست.

**نموذج الحل:**
1. **حذف ⇒:** `∀x [¬Bird(x) ∨ ∃y Wings(y) ∧ HasWings(x,y)]`
2. **نقل ¬ للداخل:** لا تغيير (لا `¬∀` أو `¬∃`)
3. **توحيد المتحولات:** `∀x [¬Bird(x) ∨ ∃z Wings(z) ∧ HasWings(x,z)]`
4. **Skolemize:** `∃z` داخل `∀x` → `z = F(x)`: `∀x [¬Bird(x) ∨ Wings(F(x)) ∧ HasWings(x,F(x))]`
5. **حذف ∀:** `¬Bird(x) ∨ [Wings(F(x)) ∧ HasWings(x,F(x))]`
6. **توزيع ∧ على ∨:** `[¬Bird(x) ∨ Wings(F(x))] ∧ [¬Bird(x) ∨ HasWings(x,F(x))]`

**الناتج النهائي (بندان):**
- `¬Bird(x) ∨ Wings(F(x))`
- `¬Bird(x) ∨ HasWings(x,F(x))`

---

### تمرين 4: Forward Chaining يدوي — `search_trace`

**السيناريو / المطلوب:**
```
KB:
  ∀x Wet(x) ⇒ Slippery(x)
  ∀x Rain(x) ⇒ Wet(x)
  Rain(street)
```
الهدف: `Slippery(street)`

**المطلوب:**
1. أكمل جدول التسلسل الأمامي
2. ما الاستنتاج النهائي؟

**جدول ناقص للطالب:**

| الدورة | القاعدة | θ | الاستنتاج الجديد |
| --- | --- | --- | --- |
| 1 | `Rain(x)⇒Wet(x)` | ؟ | ؟ |
| 2 | ؟ | ؟ | ؟ |

**نموذج الحل:**

| الدورة | القاعدة | θ | الاستنتاج الجديد |
| --- | --- | --- | --- |
| 1 | `Rain(x)⇒Wet(x)` | `{x/street}` | `Wet(street)` |
| 2 | `Wet(x)⇒Slippery(x)` | `{x/street}` | `Slippery(street)` ✅ |

**الاستنتاج:** `Slippery(street)` في دورتين.

---

### تمرين 5: تطبيق Skolemization — `fill_gaps`

**السيناريو / المطلوب:**
أعط `Skolem term` المناسب لكل `∃`:

1. `∃x P(x)` (بدون `∀` خارجي)
2. `∀y ∃x Loves(x,y)` (∃x داخل ∀y)
3. `∀a ∀b ∃c Between(a,c,b)` (∃c داخل ∀a ∀b)
4. `∀x [∃y Father(y,x) ∧ ∃z Mother(z,x)]` (اثنان ∃ داخل ∀x)

**نموذج الحل:**
1. `C₁` (ثابت سكولم جديد)
2. `F(y)` (دالة سكولم في `y`)
3. `G(a,b)` (دالة سكولم في `a` و`b`)
4. `∃y → F(x)`، `∃z → H(x)` (دالتان مختلفتان لكل وجودي مستقل)

---

### تمرين 6: تحليل Backward Chaining — `scenario`

**السيناريو:**
```
KB:
  Mammal(x) ⇒ Animal(x)
  Dog(x) ⇒ Mammal(x)
  Dog(Rex)
```
الهدف: `Animal(Rex)`

**المطلوب:** ارسم شجرة `Backward Chaining` كاملة بما فيها التعيينات.

**نموذج الحل:**
```
Animal(Rex)                          ← الهدف
  ↓ [Mammal(x)⇒Animal(x), θ={x/Rex}]
Mammal(Rex)                          ← هدف فرعي
  ↓ [Dog(x)⇒Mammal(x), θ={x/Rex}]
Dog(Rex)                             ← حقيقة في KB ✅
```
**التعيين الكلي:** `{x/Rex}`
**النتيجة:** `Animal(Rex)` مثبتة.

---

## الجزء الرابع: تمارين تحليل وتطبيق

---

### تمرين 1: إكمال جدول Unification — `table_fill`

**السيناريو:**
أكمل الجدول:

| p | q | θ |
| --- | --- | --- |
| `Knows(x, y)` | `Knows(John, Mary)` | ؟ |
| `Knows(x, x)` | `Knows(John, Mary)` | ؟ |
| `Ancestor(x, Bob)` | `Ancestor(Father(y), Bob)` | ؟ |
| `f(x, g(x))` | `f(a, g(a))` | ؟ |
| `P(x, f(x, y))` | `P(f(z), f(f(z), z))` | ؟ |

**نموذج الحل:**

| p | q | θ |
| --- | --- | --- |
| `Knows(x, y)` | `Knows(John, Mary)` | `{x/John, y/Mary}` |
| `Knows(x, x)` | `Knows(John, Mary)` | `fail` (x=John وx=Mary تعارض) |
| `Ancestor(x, Bob)` | `Ancestor(Father(y), Bob)` | `{x/Father(y)}` |
| `f(x, g(x))` | `f(a, g(a))` | `{x/a}` |
| `P(x, f(x, y))` | `P(f(z), f(f(z), z))` | `{x/f(z), y/z}` |

---

### تمرين 2: تتبع Resolution — `resolution_steps`

**السيناريو:**
```
KB:
  ∀x Human(x) ⇒ Mortal(x)
  Human(Socrates)
الهدف: Mortal(Socrates)
```

**المطلوب:** أثبت `Mortal(Socrates)` بـ `Resolution` خطوة بخطوة.

**نموذج الحل:**

**الخطوة 1: تحويل KB إلى CNF:**
- `¬Human(x) ∨ Mortal(x)` (من القاعدة)
- `Human(Socrates)` (حقيقة)
- `¬Mortal(Socrates)` (نفي الهدف)

**الخطوة 2: تطبيق Resolution:**

| الخطوة | البند 1 | البند 2 | θ | الناتج |
| --- | --- | --- | --- | --- |
| 1 | `¬Human(x) ∨ Mortal(x)` | `Human(Socrates)` | `{x/Socrates}` | `Mortal(Socrates)` |
| 2 | `Mortal(Socrates)` | `¬Mortal(Socrates)` | `{}` | `□` (فارغة) ✅ |

**النتيجة:** تناقض → `Mortal(Socrates)` مثبتة.

---

### تمرين 3: مقارنة Forward/Backward Chaining — `written_analysis`

**السيناريو:**
لديك `KB` بـ 1000 حقيقة و50 قاعدة. الهدف `G` يتطلب سلسلة من 5 قواعد من الحقائق إليه.

**المطلوب:** قارن `Forward Chaining` و`Backward Chaining` لهذا السيناريو من حيث: الكفاءة، الاستنتاجات المولّدة، التوجّه للهدف.

**نموذج الحل:**

| المعيار | `Forward Chaining` | `Backward Chaining` |
| --- | --- | --- |
| **الاستنتاجات المولّدة** | قد يولّد مئات الاستنتاجات غير المرتبطة | يولّد فقط ما هو مطلوب لـ `G` |
| **الكفاءة** | أقل كفاءة — ينتج حقائق «غير ذات صلة» | أكثر كفاءة في هذا السيناريو |
| **التوجّه** | لا يتوجّه للهدف | موجّه للهدف `G` |
| **المسار** | 1000 حقيقة → قواعد عديدة → قد يصل G | `G` → 5 أهداف فرعية → 5 حقائق |
| **التوصية** | مفيد إذا أردت استنتاج كل شيء ممكن | الأفضل هنا لأن الهدف محدد |

---

### تمرين 4: تحليل Heuristic — `heuristic_eval`

**السيناريو:**
في `Forward Chaining` على `KB` بـ `p=5` محمولات ثنائية و`n=4` ثوابت:

**المطلوب:**
1. احسب الحد الأقصى لعدد الحقائق الأرضية (`ground facts`)
2. هل يتوقف `FC` مضموناً؟ لماذا؟

**نموذج الحل:**
1. عدد الحقائق = `p · nᵏ = 5 · 4² = 5 · 16 = 80` حقيقة كحد أقصى
2. نعم يتوقف — لأن هذا يُكافئ `Datalog` (محمولات بلا دوال) → `FC` يتوقف بعد `p·nᵏ = 80` حقيقة كحد أقصى

---

## الجزء الرابع: تمارين تتبع الخوارزميات (خطوة بخطوة)

---

### تمرين تتبع 1: Forward Chaining — تتبع كامل

**المدخل:**
```
KB:
  Rains ⇒ WetGrass
  WetGrass ∧ Cold ⇒ Slippery
  Cold
  Rains
```
الهدف: `Slippery`

**أكمل الجدول:**

| الدورة | الحقائق الجديدة | هل الهدف محقق؟ |
| --- | --- | --- |
| 1 | ؟ | ؟ |
| 2 | ؟ | ؟ |

**نموذج الحل:**

| الدورة | الحقائق الجديدة | هل الهدف محقق؟ |
| --- | --- | --- |
| 1 | `WetGrass` (من `Rains⇒WetGrass`) | لا |
| 2 | `Slippery` (من `WetGrass∧Cold⇒Slippery`) | ✅ نعم |

**النتيجة النهائية:** `Slippery` محققة في دورتين.

**سؤال MCQ مصاحب:**
في الدورة 1 من التسلسل أعلاه، ما الحقيقة المشتقة؟
أ) `Slippery`  ب) `Cold`  ج) `WetGrass`  د) `Rains`
**الجواب: ج**

---

### تمرين تتبع 2: Backward Chaining — سلسلة قواعد

**المدخل:**
```
KB:
  Z(x) ⇒ W(x)
  Y(x) ⇒ Z(x)
  X(x) ⇒ Y(x)
  X(a)
```
الهدف: `W(a)`

**أكمل جدول الأهداف:**

| الخطوة | الهدف الحالي | القاعدة المستخدمة | الهدف الجديد |
| --- | --- | --- | --- |
| 1 | `W(a)` | ؟ | ؟ |
| 2 | ؟ | ؟ | ؟ |
| 3 | ؟ | ؟ | ؟ |
| 4 | ؟ | حقيقة | محقق ✅ |

**نموذج الحل:**

| الخطوة | الهدف الحالي | القاعدة المستخدمة | الهدف الجديد |
| --- | --- | --- | --- |
| 1 | `W(a)` | `Z(x)⇒W(x)`, `{x/a}` | `Z(a)` |
| 2 | `Z(a)` | `Y(x)⇒Z(x)`, `{x/a}` | `Y(a)` |
| 3 | `Y(a)` | `X(x)⇒Y(x)`, `{x/a}` | `X(a)` |
| 4 | `X(a)` | حقيقة مباشرة | ✅ محقق |

**النتيجة النهائية:** `W(a)` مثبتة في 4 خطوات.

**سؤال MCQ مصاحب:**
ما الهدف في الخطوة 3؟
أ) `Z(a)`  ب) `Y(a)`  ج) `X(a)`  د) `W(a)`
**الجواب: ب**

---

### تمرين تتبع 3: Resolution Proof — إثبات بالدحض

**المدخل:**
```
KB:
  ∀x Barks(x) ⇒ Dog(x)
  ∀x Dog(x) ⇒ Animal(x)
  Barks(Fido)
الهدف: Animal(Fido)
```

**أكمل جدول Resolution:**

| الخطوة | البند 1 | البند 2 | θ | الناتج |
| --- | --- | --- | --- | --- |
| CNF | `¬Barks(x) ∨ Dog(x)` | `¬Dog(y) ∨ Animal(y)` | — | — |
| + نفي الهدف | — | `¬Animal(Fido)` | — | — |
| 1 | ؟ | ؟ | ؟ | ؟ |
| 2 | ؟ | ؟ | ؟ | ؟ |
| 3 | ؟ | ؟ | ؟ | `□` |

**نموذج الحل:**

| الخطوة | البند 1 | البند 2 | θ | الناتج |
| --- | --- | --- | --- | --- |
| 1 | `¬Dog(y) ∨ Animal(y)` | `¬Animal(Fido)` | `{y/Fido}` | `¬Dog(Fido)` |
| 2 | `¬Barks(x) ∨ Dog(x)` | `¬Dog(Fido)` | `{x/Fido}` | `¬Barks(Fido)` |
| 3 | `¬Barks(Fido)` | `Barks(Fido)` | `{}` | `□` ✅ |

**النتيجة:** تناقض → `Animal(Fido)` مثبتة.

---

### تمرين تتبع 4: Prolog Execution — تتبع Prolog

**المدخل:**
```prolog
parent(tom, bob).
parent(bob, ann).
ancestor(X, Y) :- parent(X, Y).
ancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).
```
الاستعلام: `ancestor(tom, ann)?`

**أكمل مسار التنفيذ:**

| الخطوة | الهدف | القاعدة | التعيين |
| --- | --- | --- | --- |
| 1 | `ancestor(tom, ann)` | ؟ | ؟ |
| 2 | ؟ | ؟ | ؟ |
| ... | ... | ... | ... |

**نموذج الحل:**

| الخطوة | الهدف | القاعدة | التعيين |
| --- | --- | --- | --- |
| 1 | `ancestor(tom, ann)` | `ancestor(X,Y):-parent(X,Y)`, `{X/tom,Y/ann}` | يحاول `parent(tom,ann)` → فشل |
| 2 | `ancestor(tom, ann)` | `ancestor(X,Y):-parent(X,Z),ancestor(Z,Y)`, `{X/tom,Y/ann}` | `parent(tom,Z)` |
| 3 | `parent(tom, Z)` | حقيقة `parent(tom,bob)` | `{Z/bob}` |
| 4 | `ancestor(bob, ann)` | `ancestor(X,Y):-parent(X,Y)`, `{X/bob,Y/ann}` | `parent(bob,ann)` |
| 5 | `parent(bob, ann)` | حقيقة ✅ | `{}` |

**النتيجة:** `ancestor(tom, ann)` = `true` ✅

---

## الجزء الرابع: أسئلة تصميم

---

### سؤال تصميم 1: تصميم قاعدة معرفة — `architecture`

**المطلوب:**
صمّم قاعدة معرفة `FOL` لنظام تشخيص طبي بسيط يعرف: أن المرض `X` يسبب الأعراض `Y`، وأن المريض `Z` لديه أعراض معينة، والهدف هو استنتاج تشخيص المرض المحتمل.

**نموذج الإجابة:**
```
// Facts (حقائق)
HasSymptom(patient1, fever)
HasSymptom(patient1, cough)
HasSymptom(patient2, rash)
HasSymptom(patient2, fever)

// Rules (قواعد)
∀p HasSymptom(p, fever) ∧ HasSymptom(p, cough) ⇒ PossiblyHas(p, flu)
∀p HasSymptom(p, rash) ∧ HasSymptom(p, fever) ⇒ PossiblyHas(p, measles)
∀p PossiblyHas(p, D) ⇒ ShouldTest(p, D)

// Query
ShouldTest(patient1, ?)   → ShouldTest(patient1, flu)
ShouldTest(patient2, ?)   → ShouldTest(patient2, measles)
```

**استراتيجية الاستنتاج:** `Forward Chaining` — مناسب لأننا نريد استنتاج كل التشخيصات المحتملة.

**معايير التقييم:**
- وجود حقائق (`ground facts`) لكل مريض وعرض
- قواعد `Definite Clauses` صحيحة تربط الأعراض بالأمراض
- الهدف قابل للاستنتاج بـ `GMP`
- اختيار `Forward Chaining` مُبرَّر

---

### سؤال تصميم 2: رسم مخطط Resolution — `uml_design`

**المطلوب:**
ارسم مخطط `Resolution Proof` لإثبات `Q(b)` من:
```
∀x P(x) ⇒ Q(x)
P(b)
```

**نموذج الإجابة:**

```
البنود الأولية:
  C1: ¬P(x) ∨ Q(x)    (من القاعدة)
  C2: P(b)              (حقيقة)
  C3: ¬Q(b)             (نفي الهدف)

خطوة 1:
  RESOLVE(C1, C2) مع θ={x/b}:
  → Q(b)                (C4)

خطوة 2:
  RESOLVE(C4, C3):
  → □  (جملة فارغة — تناقض)

النتيجة: Q(b) مثبتة بالدحض ✅
```

**معايير التقييم:**
- تحويل القاعدة إلى بند `CNF` صحيح
- إضافة نفي الهدف
- تطبيق `Resolution` مع `Unification` صحيح
- الوصول للجملة الفارغة `□`

---

## الجزء الرابع: بطاقات سؤال وجواب (Q&A Cards)

**Q1:** ما هو `Universal Instantiation (UI)`؟
**A:** استبدال متحول كلي `∀v` في جملة `α` بأي `ground term g` للحصول على `SUBST({v/g}, α)` — يُضاف للـ `KB` مع الحفاظ على التكافؤ المنطقي.

---

**Q2:** ما الفرق بين `Skolem constant` و`Skolem function`؟
**A:** `Skolem constant` يُستخدم عند `∃v` خارج نطاق أي `∀`؛ `Skolem function F(x)` تُستخدم عند `∃v` داخل نطاق `∀x` لأن الوجود يعتمد على `x`.

---

**Q3:** متى تفشل `UNIFY(α, β)`؟
**A:** تفشل عندما: (1) المحمولات مختلفة، (2) عدد الوسائط مختلف، (3) تعارض التعيينات (مثل `x=a` و`x=b` في آنٍ)، (4) `Occur Check` — `x` يظهر في `F(x)`.

---

**Q4:** ما هي `Definite Clause`؟
**A:** بند `FOL` يحتوي **بالضبط** حرفاً إيجابياً واحداً — مثل `¬p₁ ∨ ¬p₂ ∨ q` أي `p₁ ∧ p₂ ⇒ q`.

---

**Q5:** ما هو `GMP` ومتى يُستخدم؟
**A:** `Generalized Modus Ponens` = مزج `Modus Ponens` مع `Unification` للعمل مع `Definite Clauses` التي تحتوي متحولات. يُستخدم في `Forward/Backward Chaining`.

---

**Q6:** ما خاصية `Forward Chaining` من حيث الاكتمال؟
**A:** كامل وصحيح لـ `FOL Definite Clauses`. مضمون التوقف مع `Datalog` (بلا دوال). قد لا يتوقف مع `function symbols` إذا كان الهدف غير معلول.

---

**Q7:** ما هو `Datalog`؟
**A:** `Datalog` = `FOL Definite Clauses` بدون `function symbols`. يتوقف `Forward Chaining` فيه بعد `p·nᵏ` تكراراً كحد أقصى.

---

**Q8:** ما مشكلة `Backward Chaining` الرئيسية؟
**A:** **غير كامل** بسبب الحلقات اللانهائية. الحل: فحص الهدف الحالي مقابل كل الأهداف في المكدس. كذلك يعاني من الأهداف الفرعية المتكررة — يُحل بـ `Caching`.

---

**Q9:** ما هو `Propositionalization` ومتى يفشل؟
**A:** تحويل `FOL KB` إلى منطق قضوي بتطبيق `UI` بكل الطرق. يفشل عملياً مع `function symbols` لأن `ground terms` تصبح لانهائية.

---

**Q10:** ما مبرهنة هربراند (1930)؟
**A:** إذا كانت جملة `α` معلولة بـ `FOL KB`، فهي معلولة بمجموعة **منتهية** من الـ `KB` القضوي المُنشأ بتطبيق `UI`.

---

**Q11:** ما معنى `semidecidable` في سياق `FOL`؟
**A:** الاستنتاج في `FOL` نصف قابل للقرار: يمكن إثبات الجملة المعلولة في وقت منتهٍ، لكن لا يمكن إثبات عدم الاستلزام في وقت منتهٍ (قد تدور الحلقة).

---

**Q12:** ما هي خطوات تحويل جملة `FOL` إلى `CNF`؟
**A:** ست خطوات: (1) حذف `⟺` و`⇒`، (2) نقل `¬` للداخل، (3) توحيد المتحولات، (4) `Skolemize`، (5) حذف `∀`، (6) توزيع `∧` على `∨`.

---

**Q13:** ما هو `Resolution` في `FOL` وكيف يختلف عن `GMP`؟
**A:** `Resolution` = دمج بندَيْن (`clauses`) بحذف حرف وتوأمه المنفي بعد `Unification`. يعمل على أي `CNF` (أشمل من `GMP` الذي يقتصر على `Definite Clauses`). كامل لـ `FOL` كاملاً.

---

**Q14:** كيف يُثبت `Resolution` جملة `α`؟
**A:** بالدحض (`Refutation`): أضف `¬α` للـ `KB`، حوّل `KB ∧ ¬α` لـ `CNF`، طبّق `Resolution` حتى تصل `□` (جملة فارغة) → تناقض → `α` صحيحة.

---

**Q15:** ما `Closed World Assumption` في `Prolog`؟
**A:** ما لا يُثبت صحته في `KB` يُعتبر خاطئاً (`Negation as Failure`). مثال: `alive(joe) :- not dead(joe)` → `alive(joe)` يتحقق إذا فشل `dead(joe)`.

---

**Q16:** ما الفرق بين `Forward Chaining` و`Backward Chaining` من حيث التوجّه؟
**A:** `FC` يبدأ من الحقائق ويشتق كل ما يمكن اشتقاقه (غير موجّه للهدف). `BC` يبدأ من الهدف ويبحث عن ما يُثبته (موجّه للهدف — أكفأ عند وجود هدف محدد).

---

**Q17:** متى نفضّل `Forward Chaining` على `Backward Chaining`؟
**A:** عند الرغبة في استنتاج كل الحقائق الممكنة (قواعد بيانات استنتاجية)، أو عند وجود أهداف متعددة غير محددة مسبقاً.

---

**Q18:** ما هو `MGU` (Most General Unifier)؟
**A:** المُوحِّد الأكثر عمومية = التعيين `θ` الأقل تقييداً الذي يوحّد تعبيرَيْن. «الأقل تقييداً» يعني أنه لا يُقيّد متحولات أكثر مما هو ضروري — يُبقي المرونة القصوى.

---

## الجزء الخامس: الخوارزميات الكاملة (مرجع Pseudocode)

> مرجع pseudocode كامل — بدون شرح جديد. كل خوارزمية في كتلة مستقلة.

```text
// ============================================================
// UNIVERSAL INSTANTIATION (UI)
// ============================================================
function UI(KB, sentence, ground_term):
  // sentence: ∀v α
  // ground_term: g (any ground term)
  new_sentence ← SUBST({v / ground_term}, alpha)
  KB.add(new_sentence)   // Keeps original sentence too
  return KB
```

```text
// ============================================================
// EXISTENTIAL INSTANTIATION (EI)
// ============================================================
function EI(KB, sentence):
  // sentence: ∃v α
  k ← new_unique_skolem_constant()   // Never seen in KB before
  new_sentence ← SUBST({v / k}, alpha)
  KB.remove(sentence)                // Replace, don't add
  KB.add(new_sentence)
  return KB
```

```text
// ============================================================
// UNIFICATION
// ============================================================
function UNIFY(x, y, theta = {}):
  if theta = fail: return fail
  if x = y: return theta
  if IS-VARIABLE(x): return UNIFY-VAR(x, y, theta)
  if IS-VARIABLE(y): return UNIFY-VAR(y, x, theta)
  if IS-COMPOUND(x) and IS-COMPOUND(y):
    if OP(x) ≠ OP(y): return fail
    return UNIFY(ARGS(x), ARGS(y), UNIFY(OP(x), OP(y), theta))
  return fail

function UNIFY-VAR(var, x, theta):
  if {var/val} ∈ theta: return UNIFY(val, x, theta)
  if {x/val} ∈ theta: return UNIFY(var, val, theta)
  if OCCURS-IN(var, x): return fail   // Occur Check
  return EXTEND(theta, var, x)
```

```text
// ============================================================
// FORWARD CHAINING (FOL-FC-ASK)
// ============================================================
function FOL-FC-ASK(KB, alpha):
  repeat
    new ← {}
    for each sentence r in KB:
      (p1 ∧ ... ∧ pn ⇒ q) ← STANDARDIZE-APART(r)
      for each θ s.t. (p1∧...∧pn)θ = (p1'∧...∧pn')θ for some p1',...,pn' in KB:
        q' ← SUBST(θ, q)
        if q' not a renaming of sentence in KB or new:
          add q' to new
          φ ← UNIFY(q', alpha)
          if φ ≠ fail: return φ
    add new to KB
  until new is empty
  return false
```

```text
// ============================================================
// BACKWARD CHAINING (FOL-BC-ASK)
// ============================================================
function FOL-BC-ASK(KB, goals, theta = {}):
  if goals is empty: return {theta}
  answers ← {}
  q' ← SUBST(theta, FIRST(goals))
  for each sentence r in KB:
    (p1 ∧ ... ∧ pn ⇒ q) ← STANDARDIZE-APART(r)
    theta' ← UNIFY(q, q')
    if theta' ≠ fail:
      new_goals ← [p1,...,pn | REST(goals)]
      answers ← FOL-BC-ASK(KB, new_goals, COMPOSE(theta', theta)) ∪ answers
  return answers
```

```text
// ============================================================
// CONVERSION TO CNF
// ============================================================
function TO-CNF(sentence):
  sentence ← ELIMINATE-BICONDITIONALS(sentence)    // Step 1
  sentence ← ELIMINATE-IMPLICATIONS(sentence)      // Step 2: α⇒β → ¬α∨β
  sentence ← MOVE-NOT-INWARDS(sentence)             // Step 3: De Morgan + Quantifier duality
  sentence ← STANDARDIZE-VARIABLES(sentence)       // Step 4: each quantifier uses unique var
  sentence ← SKOLEMIZE(sentence)                   // Step 5: replace ∃ with Skolem terms
  sentence ← DROP-UNIVERSAL-QUANTIFIERS(sentence)  // Step 6: ∀ now implicit
  sentence ← DISTRIBUTE-AND-OVER-OR(sentence)      // Step 7: CNF distribution
  return sentence

function SKOLEMIZE(sentence):
  for each ∃v inside scope of ∀x1,...,∀xk:
    replace v with new_skolem_function(x1,...,xk)
  for each ∃v NOT inside any ∀:
    replace v with new_skolem_constant()
  return sentence
```

```text
// ============================================================
// RESOLUTION (FOL Resolution Step)
// ============================================================
function RESOLVE(c1, c2):
  // c1, c2: clauses (sets of literals)
  resolvents ← {}
  for each literal Li in c1:
    for each literal Mj in c2:
      theta ← UNIFY(Li, NOT(Mj))
      if theta ≠ fail:
        resolvent ← SUBST(theta, (c1 - {Li}) ∪ (c2 - {Mj}))
        resolvents.add(resolvent)
  return resolvents

function RESOLUTION-PROOF(KB, alpha):
  clauses ← CNF(KB ∧ NOT(alpha))   // Add negated goal
  new ← {}
  loop:
    for each pair (Ci, Cj) in clauses:
      resolvents ← RESOLVE(Ci, Cj)
      if □ ∈ resolvents: return true   // Empty clause = contradiction
      new ← new ∪ resolvents
    if new ⊆ clauses: return false     // No new clauses = not entailed
    clauses ← clauses ∪ new
```

---

## الجزء الخامس: أسئلة نظرية متوقعة بالامتحان

---

### السؤال 1: ما هو `Universal Instantiation` وما شروطه؟
**نموذج الإجابة:**
1. **التعريف:** استبدال المتحول الكلي `v` في `∀v α` بـ `ground term g` للحصول على `SUBST({v/g}, α)`.
2. **الشروط:** `g` يجب أن يكون `ground term` (بدون متحولات). يمكن تطبيقه مرات غير محدودة.
3. **مثال:** من `∀x King(x)⇒Evil(x)` → `King(John)⇒Evil(John)` بوضع `g=John`.
4. **متى نستخدم:** لاشتقاق حقائق محددة من قواعد عامة؛ خطوة أساسية في `Propositionalization`.

---

### السؤال 2: اشرح الفرق بين `Forward Chaining` و`Backward Chaining`.
**نموذج الإجابة:**
1. **التعريف:** `FC` = من الحقائق نحو الهدف؛ `BC` = من الهدف نحو الحقائق.
2. **المكونات:** كلاهما يستخدم `GMP` و`Unification`؛ `FC` يستخدم `FOL-FC-ASK`، `BC` يستخدم `FOL-BC-ASK`.
3. **مثال:** لإثبات `Criminal(West)`: `FC` يشتق `Weapon(M1)` ثم `Sells(...)` ثم `Criminal(West)`؛ `BC` يبدأ من `Criminal(West)` ويبحث عما يستلزمه.
4. **متى نستخدم:** `FC` لاستنتاج كل الحقائق؛ `BC` عند وجود هدف محدد.

---

### السؤال 3: ما هو `Unification` ولماذا هو ضروري في `FOL`؟
**نموذج الإجابة:**
1. **التعريف:** إيجاد تعيين `θ` بحيث `αθ = βθ` لتعبيرَيْن `α` و`β`.
2. **المكونات:** `Substitution` (الإحلال)، `MGU` (الأكثر عمومية)، `Standardize Apart` (منع التعارض).
3. **مثال:** `UNIFY(P(x,John), P(Mary,y))` = `{x/Mary, y/John}`.
4. **متى نستخدم:** في كل عملية استنتاج في `FOL` — بدون `Unification` لا يمكن مطابقة القواعد مع الحقائق المحتوية متحولات.

---

### السؤال 4: لماذا `Existential Instantiation` يُطبَّق مرة واحدة فقط؟
**نموذج الإجابة:**
1. **التعريف:** `EI` يُحل محل (`replace`) الجملة الوجودية بجملة تستخدم ثابت سكولم جديد.
2. **السبب:** `EI` يُنتج `KB` **غير مكافئ** للأصلي — تطبيقه مرتين قد ينتج ثوابت سكولم مختلفة لنفس الكيان ويُربك الاستنتاج.
3. **مثال:** `∃x P(x)` → `P(C₁)`. إذا طبّقنا مرة ثانية: `P(C₂)` — وهذا يعني كيانَيْن مختلفَيْن بينما ربما الأصل يُشير لكيان واحد.
4. **متى نستخدم:** مرة واحدة فقط لكل جملة وجودية.

---

### السؤال 5: ما خصائص `Resolution` في `FOL`؟
**نموذج الإجابة:**
1. **التعريف:** قاعدة استنتاج تدمج بندَيْن بحذف حرف وتوأمه المنفي بعد `Unification`.
2. **المكونات:** `Refutation` (الدحض)، `CNF`، `Empty Clause □`.
3. **مثال:** `Rich(x)∨¬Wise(x)` + `Wise(Ken)` → `Rich(Ken)` بـ `θ={x/Ken}`.
4. **الخصائص:** صحيحة وكاملة لـ `FOL` كاملاً. تعمل على أي `CNF` (ليس فقط `Definite Clauses`).

---

### السؤال 6: ما الفرق بين `GMP` و`Resolution`؟
**نموذج الإجابة:**
1. **التعريف:** `GMP` = `Modus Ponens` المُعمَّم للـ `Definite Clauses`؛ `Resolution` = قاعدة استنتاج عامة للـ `CNF`.
2. **المكونات/الشروط:** `GMP` يقتصر على جُمَل `(p₁∧...∧pₙ⇒q)`. `Resolution` يعمل على أي `(l₁∨...∨lₖ)`.
3. **مثال:** `GMP` لا يستطيع التعامل مع `¬A∨¬B∨¬C` (ليست `Definite`)؛ `Resolution` يستطيع.
4. **متى نستخدم:** `GMP` لـ `Chaining` على `Definite Clauses`؛ `Resolution` للإثبات الكامل.

---

### السؤال 7: ما هي مشكلة مطابقة المقدمات التعاملية ولماذا هي `NP-hard`؟
**نموذج الإجابة:**
1. **التعريف:** إيجاد تعيين `θ` يوحّد `n` مقدمة في قاعدة مع حقائق معروفة في `KB` دفعة واحدة.
2. **السبب:** تكافئ حل `CSP` — و`CSP` يشمل `3SAT` كحالة خاصة (كما في مثال تلوين الخريطة).
3. **مثال:** قاعدة `Diff(wa,nt)∧...∧Diff(v,sa)⇒Colorable()` — مطابقتها مع الألوان = حل تلوين خريطة = `CSP`.
4. **متى نستخدم:** الوعي بهذا يدفعنا لاستخدام `Database Indexing` وتحسينات أخرى.

---

### السؤال 8: لماذا `Backward Chaining` ناقص وكيف يُصلَح؟
**نموذج الإجابة:**
1. **التعريف:** `BC` ناقص بمعنى: قد لا يجد الإثبات حتى لو كان موجوداً بسبب حلقات لانهائية.
2. **المكونات:** يعتمد على `Depth-First` بدون فحص للدورات.
3. **مثال:** `P(x):-P(f(x))` → `BC` يدخل حلقة `P(a)→P(f(a))→P(f(f(a)))→...`
4. **الحل:** (1) `Loop Detection`: فحص الهدف مقابل كل أهداف المكدس. (2) `Caching`: تخزين الأهداف الفرعية المحلولة.

---

### السؤال 9: ما الفرق بين `Propositionalization` المباشر وخوارزميات `Chaining`؟
**نموذج الإجابة:**
1. **التعريف:** `Propositionalization` = تحويل كامل للـ `FOL KB` إلى قضوي؛ `Chaining` = استنتاج مباشر في `FOL` بـ `Unification`.
2. **المكونات:** `Propositionalization` ينتج `ground terms` لا حصر لها؛ `Chaining` يعمل مع المتحولات مباشرة.
3. **مثال:** `Propositionalization` لـ `∀x King(x)` ينتج `King(John), King(Richard),...`؛ `FC` يوحّد `x` مع الحقائق مباشرة.
4. **متى نستخدم:** `Propositionalization` لـ `KB` صغير بلا دوال؛ `Chaining` للعمل الأكثر كفاءة.

---

### السؤال 10: ما هو `Prolog` وكيف يختلف عن `FOL` القياسي؟
**نموذج الإجابة:**
1. **التعريف:** `Prolog` = نظام برمجة منطقية يطبّق `Backward Chaining` على `Horn Clauses`.
2. **المكونات:** `Open Coding` للـ `Unification`، ربط مباشر للجُمَل، `CWA`، `Depth-First`.
3. **الاختلافات:** `Prolog` يستخدم `CWA` (ما لا يُثبت = خاطئ) و`FOL` يستخدم `OWA`؛ `Prolog` يهمل `Occur Check`؛ `Prolog` يطبّق `Depth-First` بدون ضمان اكتمال.
4. **متى نستخدم:** `Prolog` للبرمجة الرمزية والذكاء الاصطناعي الكلاسيكي؛ `FOL` النظري للتحليل المنطقي.

---

## الجزء السادس: قائمة فحص ذاتي قبل الامتحان ✅

- [ ] أفهم الفرق بين `UI` (يضيف، مرات غير محدودة، تكافؤ) و`EI` (يستبدل، مرة واحدة، توافق فقط)
- [ ] أستطيع تطبيق `UI` وإنتاج الجمل الجديدة من `∀x P(x)`
- [ ] أستطيع تطبيق `EI` وتسمية ثابت سكولم جديد صحيح
- [ ] أفهم أن `Propositionalization` صحيح نظرياً لكنه يُولّد جُملاً لانهائية مع `function symbols`
- [ ] أستطيع حل مسائل `Unification` وتحديد `θ` أو قول `fail`
- [ ] أعرف متى يفشل `UNIFY`: (1) عمليات مختلفة (2) أعداد وسائط مختلفة (3) تعارض تعيينات (4) `Occur Check`
- [ ] أفهم `Standardize Apart` وسبب الحاجة إليه
- [ ] أستطيع تطبيق `GMP` وإيجاد `θ` والنتيجة `qθ`
- [ ] أعرف أن `GMP` يعمل على `Definite Clauses` فقط
- [ ] أستطيع تتبع `Forward Chaining` خطوة بخطوة وملء الجدول
- [ ] أعرف أن `FC` كامل لـ `Datalog`، قد لا يتوقف مع `function symbols`
- [ ] أستطيع تتبع `Backward Chaining` وبناء شجرة الأهداف
- [ ] أعرف أن `BC` ناقص بسبب الحلقات وكيف يُصلَح
- [ ] أستطيع تحويل جملة `FOL` إلى `CNF` بالخطوات الست
- [ ] أعرف الفرق بين `Skolem constant` و`Skolem function` ومتى يُستخدم كل منهما
- [ ] أستطيع تطبيق خطوة `Resolution` مع `Unification`
- [ ] أفهم طريقة الدحض (`Refutation`) في `Resolution`
- [ ] أعرف أن `Resolution` كاملة لـ `FOL` بينما `GMP` لـ `Definite Clauses` فقط
- [ ] أفهم `Negation as Failure` في `Prolog` وما يختلف عن `¬` في `FOL`
- [ ] أعرف أن الاستنتاج في `FOL` `semidecidable` (مبرهنة تورينج/تشيرش 1936)
- [ ] أستطيع حل مسائل إثبات `Criminal(West)` بالثلاث طرق

---

## الجزء السادس: ورقة المراجعة السريعة (Cheat Sheet)

### 🔑 خريطة العلاقات بين المحاضرات

| المحاضرة | ترتبط مع | كيف؟ |
| --- | --- | --- |
| `FOL Syntax/Semantics` (سابقة) | هذه المحاضرة | `FOL` هو الأساس؛ نحن نستنتج الآن |
| `Propositional Logic` (سابقة) | `Propositionalization`، `Resolution` | تقنيات الاستنتاج القضوي تُعمَّم هنا |
| `Search Algorithms` (سابقة) | `Forward/Backward Chaining` | `BFS/DFS` مستخدمان في تتبع الأهداف |
| `Logic Programming/Prolog` | `Backward Chaining` | `Prolog` = تطبيق `BC` عملياً |

---

### 🔑 أهم النقاط الذهبية

| الموضوع | النقاط |
| --- | --- |
| `UI vs EI` | `UI`: أضف + حافظ على تكافؤ. `EI`: استبدل + فقدان تكافؤ. |
| `Unification` | القلب النابض لاستنتاج `FOL`. `UNIFY(α,β)=θ` بحيث `αθ=βθ`. |
| `Skolem` | `Constant` خارج `∀`؛ `Function(x)` داخل `∀x`. |
| `FC` | أمامي، كامل لـ `Datalog`، قد لا يتوقف مع دوال. |
| `BC` | خلفي، موجّه للهدف، ناقص بسبب حلقات. |
| `Resolution` | بالدحض: أضف `¬α`، `CNF`، اشتق `□`. كاملة لـ `FOL`. |
| `semidecidable` | يُثبت المعلول؛ لا يتوقف لغير المعلول. |

---

### 🔑 مرجع سريع

| الرمز/المصطلح | المعنى | يُستخدم في |
| --- | --- | --- |
| `∀v α` | لكل قيمة لـ `v`، `α` صحيحة | `UI` |
| `∃v α` | يوجد قيمة لـ `v` تجعل `α` صحيحة | `EI` |
| `SUBST(θ, α)` | تطبيق الإحلال `θ` على `α` | `UI`، `EI`، `GMP` |
| `UNIFY(α, β)` | إيجاد `θ` بحيث `αθ = βθ` | `GMP`، `FC`، `BC`، `Resolution` |
| `MGU` | المُوحِّد الأكثر عمومية | `Unification` |
| `θ = {x/t}` | إحلال: استبدل `x` بـ `t` | كل عمليات الاستنتاج |
| `COMPOSE(θ₁,θ₂)` | دمج إحلالَيْن | `BC` |
| `□` | الجملة الفارغة (تناقض) | `Resolution` |
| `CNF` | تعاملي طبيعي: `AND` من `OR`-بنود | `Resolution` |
| `Definite Clause` | بند بحرف إيجابي واحد بالضبط | `GMP`، `FC`، `BC` |
| `Datalog` | `Definite Clauses` بلا دوال | `FC` يتوقف مضموناً |
| `p·nᵏ` | الحد الأقصى للحقائق في `Datalog` | تعقيد `FC` |
| `Skolem Constant` | ثابت جديد لـ `EI` بدون `∀` خارجي | `EI`، `CNF` |
| `Skolem Function F(x)` | دالة جديدة لـ `EI` داخل `∀x` | `CNF Conversion` |

---

### 🔑 قواعد ذهبية لا تُنسى

| # | القاعدة |
| --- | --- |
| 1 | `Skolem constant` = ثابت **جديد** لم يظهر في `KB` أبداً |
| 2 | `EI` يُطبَّق **مرة واحدة** على كل جملة وجودية |
| 3 | **دائماً** `STANDARDIZE-APART` قبل `Unification` في `Chaining` |
| 4 | `∃v` داخل `∀x` → `Skolem Function F(x)`؛ خارجه → `Skolem Constant C₁` |
| 5 | `Forward Chaining` = **أضف** `new` في نهاية الدورة، ليس أثناءها |
| 6 | `Resolution` = أضف **نفي الهدف** ثم اشتق `□` |
| 7 | الاستنتاج في `FOL` **semidecidable** = يُثبت المعلول لكن لا يتوقف للمجهول |
| 8 | `GMP` = `Definite Clauses` فقط؛ `Resolution` = أي `CNF` |
| 9 | `not` في `Prolog` ≠ `¬` في `FOL` (`Negation as Failure` ≠ `Negation`) |
| 10 | `Backward Chaining` ناقص دون `Loop Detection` + `Caching` |

---

<!-- VALIDATION
lecture_type: inference_fol
sections_covered:
  - UI (Universal Instantiation)
  - EI (Existential Instantiation)
  - UI vs EI comparison
  - Propositionalization + problems
  - Herbrand theorem
  - Semidecidability (Turing/Church 1936)
  - Unification + Standardize Apart
  - GMP (Generalized Modus Ponens)
  - GMP Soundness proof
  - Forward Chaining algorithm (FOL-FC-ASK)
  - Forward Chaining proof trace (Colonel West)
  - Forward Chaining properties
  - Forward Chaining efficiency + NP-hard matching
  - Hard matching example (map coloring)
  - Backward Chaining algorithm (FOL-BC-ASK)
  - Backward Chaining trace (Colonel West)
  - Backward Chaining properties
  - Logic Programming comparison
  - Prolog systems
  - Prolog examples (DFS, append)
  - Resolution (FOL version)
  - Conversion to CNF (6 steps)
  - Resolution proof (definite clauses)
checklist:
  - mcq: 18 ✅
  - debug: 6 ✅
  - exercises: 6 ✅
  - analysis_exercises: 4 ✅
  - trace_exercises: 4 ✅
  - design_questions: 2 ✅
  - qa_cards: 18 ✅
  - theory_questions: 10 ✅
  - self_check: ✅
  - cheat_sheet: ✅
  - pseudocode_reference: 6 algorithms ✅
-->
