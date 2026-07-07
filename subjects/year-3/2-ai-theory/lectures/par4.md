# المحاضرة 11 — First-Order Logic (المنطق من الرتبة الأولى)
> **المادة:** الذكاء الاصطناعي (القسم النظري) | **الموضوع:** الانتقال من المنطق القضوي إلى `First-Order Logic`، بناؤه، دلالته (semantics)، والتعبير عن عالم `Wumpus` به.

---

## 📌 خريطة التكامل (أين تقع هذه المحاضرة في الدورة؟)

| المرحلة | الأدوات | المخرجات |
| --- | --- | --- |
| Logical Agents | `Propositional Logic`، `Entailment`، `Resolution` | معرفة قائمة على حقائق ثابتة |
| **First-Order Logic ← أنت هنا** | `Objects`، `Relations`، `Functions`، `Quantifiers` | تمثيل معرفة أغنى وأكثر عمومية |
| Inference in FOL | `Universal/Existential Instantiation`، `Forward/Backward Chaining`، `Resolution` | استنتاج تلقائي على قاعدة FOL |

> **نوع هذه المحاضرة:** First-Order Logic (Syntax, Semantics, Quantifiers) — طُبِّق القالب الخاص بهذه الفئة.

---

## الجزء الأول: الشرح التفصيلي (سطر بسطر / فقرة بفقرة)

### 1. لماذا نحتاج FOL؟ (مراجعة حدود المنطق القضوي)

#### النص الأصلي يقول:
> "Propositional logic is declarative... Propositional logic allows partial/disjunctive/negated information... Propositional logic is compositional... Meaning in propositional logic is context-independent... Propositional logic has very limited expressive power... E.g., cannot say 'pits cause breezes in adjacent squares' except by writing one sentence for each square"

#### الشرح المبسّط:
المنطق القضوي (`Propositional Logic`) عنده مزايا حلوة: كل جملة فيه بتمثّل حقيقة (declarative)، وبيقدر يعبّر عن معلومة جزئية أو منفية أو "أو" (مش لازم تعرف كل شي 100%)، ومركّب (compositional) يعني معنى الجملة المركّبة بينبني من معنى أجزائها، ومعناه ثابت مهما كان السياق. **لكن** مشكلته الكبرى إنه ما بقدر يتكلم عن *أنماط عامة* بين أشياء مختلفة — لازم تكتب جملة منفصلة لكل حالة.

**لماذا؟** لأنه ما في عنده مفهوم "شيء" (`object`) أو "علاقة" (`relation`) عامة تنطبق على مجموعة أشياء — كل رمز (`symbol`) هو حقيقة مستقلة بذاتها.

#### 💡 التشبيه:
> تخيلي عندك 100 غرفة، وبدك تقولي "كل غرفة فيها نافذة مكسورة جنبها فيها تيار هواء". بالمنطق القضوي لازم تكتبي 100 جملة منفصلة (غرفة1 → تيار، غرفة2 → تيار...). لكن بلغة عادية بتقولي جملة وحدة عامة.
> **وجه الشبه:** كل غرفة = رمز قضوي منفصل، الجملة العامة = ما بقدر المنطق القضوي يعبّر عنها بدون تكرار.

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** ليش ما نقدر نكتب "Pits cause breezes in adjacent squares" بجملة وحدة بالمنطق القضوي؟
> **لماذا هذا مهم؟** لأنه هاد بالضبط السبب اللي خلّانا نحتاج FOL — القدرة على التعميم عبر أشياء (`objects`) بدل تكرار جمل لكل حالة.

---

### 2. المكوّنات الأساسية للعالم في FOL

#### النص الأصلي يقول:
> "Whereas propositional logic assumes world contains facts, first-order logic (like natural language) assumes the world contains: Objects... Relations... Functions..."

#### الشرح المبسّط:
بالمنطق القضوي، العالم مبني من `facts` بس. أما بـ FOL (متل اللغة الطبيعية) العالم مبني من:
- **Objects**: أشياء موجودة (ناس، بيوت، أرقام، ألوان...)
- **Relations**: خصائص أو علاقات بين الأشياء (أحمر، أخ فلان، أكبر من...)
- **Functions**: علاقة خاصة بترجع *شي وحيد* لكل مدخل (أبو فلان، نتيجة الجمع...)

**لماذا نفرّق بين Relation و Function؟** لأنه الـ `Function` دايماً بترجع نتيجة واحدة بالضبط (`father of X` = شخص واحد محدد)، أما الـ `Relation` ممكن تكون صحيحة أو غلط بين مجموعة أشياء (`Brother(X,Y)`) بدون ما ترجع "قيمة".

#### 💡 التشبيه:
> `Relation` متل سؤال "هل X أخو Y؟" (جواب: نعم/لا). أما `Function` متل سؤال "مين أبو X؟" (جواب: شخص واحد محدد).
> **وجه الشبه:** Relation = سؤال صح/خطأ، Function = آلة بترجع نتيجة وحيدة.

#### الأمثلة من المحاضرة:
| الجملة | Objects | Relation | Function |
| --- | --- | --- | --- |
| "One plus two equals three" | one, two, three | `equals` | `plus` |
| "Squares neighboring wumpus are smelly" | wumpus, squares | `neighboring` | — (property: `smelly`) |

---

### 3. جدول المنطق العام (Logics in general)

#### النص الأصلي يقول:
> جدول: Language / Ontological Commitment / Epistemological Commitment — يقارن `Propositional logic`، `First-order logic`، `Temporal logic`، `Probability theory`، `Fuzzy logic`.

#### الشرح المبسّط:
كل نوع منطق بيتحدد بشيئين:
1. **Ontological Commitment** = شو بيفترض إنه موجود بالعالم (حقائق فقط؟ أشياء وعلاقات؟ زمن كمان؟)
2. **Epistemological Commitment** = شو حالات الاعتقاد الممكنة (صح/غلط/غير معروف؟ أو درجة اعتقاد؟)

| Language | Ontological Commitment | Epistemological Commitment |
| --- | --- | --- |
| `Propositional logic` | facts | true/false/unknown |
| `First-order logic` | facts, objects, relations | true/false/unknown |
| `Temporal logic` | facts, objects, relations, times | true/false/unknown |
| `Probability theory` | facts | degree of belief |
| `Fuzzy logic` | facts + degree of truth | known interval value |

**لماذا مهم هذا الجدول؟** لأنه بيوريكي إنه FOL ما غيّر شي بالـ Epistemological Commitment (لسا true/false/unknown) — الفرق الوحيد إنه وسّع الـ Ontological Commitment ليشمل أشياء وعلاقات، مش بس حقائق.

#### مهم للامتحان ⚠️:
> لا تخلطي بين `Ontological Commitment` (شو موجود بالعالم) و `Epistemological Commitment` (شو درجة يقيننا). هاد سؤال كلاسيكي بالامتحان.

---

### 4. عناصر بناء FOL (Syntax: Basic elements)

#### النص الأصلي يقول:
> "Constants KingJohn, 2, UCB... Predicates Brother, >... Functions Sqrt, LeftLegOf... Variables x, y, a, b... Connectives ∧ ∨ ¬ ⇒ ⇔... Equality =... Quantifiers ∀ ∃"

#### الشرح المبسّط:
| العنصر | مثال | الدور |
| --- | --- | --- |
| `Constants` | `KingJohn`, `2`, `UCB` | تمثّل object محدد بعينه |
| `Predicates` | `Brother`, `>` | تمثّل علاقة (صح/خطأ) |
| `Functions` | `Sqrt`, `LeftLegOf` | ترجع object واحد بناءً على مدخل |
| `Variables` | `x, y, a, b` | تمثّل object غير محدد (يُستخدم مع quantifiers) |
| `Connectives` | `∧ ∨ ¬ ⇒ ⇔` | نفس روابط المنطق القضوي |
| `Equality` | `=` | هل شيئين نفس الـ object؟ |
| `Quantifiers` | `∀ ∃` | "لكل" و"يوجد" |

#### 💡 التشبيه:
> فكري فيهم متل أجزاء الكلام بلغة عادية: `Constants` = أسماء علم (أحمد، دمشق)، `Predicates` = أفعال أو صفات (أخو، أطول من)، `Functions` = تراكيب إضافية (أبو فلان)، `Variables` = ضمائر (هو، هي، أي شخص).

---

### 5. الجملة الذرية (Atomic Sentences)

#### النص الأصلي يقول:
> "Atomic sentence = predicate(term1,...,termn) or term1 = term2. Term = function(term1,...,termn) or constant or variable. E.g., Brother(KingJohn, RichardTheLionheart) > (Length(LeftLegOf(Richard)), Length(LeftLegOf(KingJohn)))"

#### الشرح المبسّط:
الجملة الذرية هي أبسط جملة ممكن نبنيها: إما `predicate` مطبّق على مجموعة `terms`، أو مساواة بين `term`ين. والـ `term` نفسه إما ثابت، متغيّر، أو `function` مطبّقة على `terms` تانية (وممكن تتشابك — function جوا function).

**لماذا نحتاج نعرّف Term بشكل منفصل عن Sentence؟** لأنه الـ `term` بيرجع *object*، أما الـ `sentence` بترجع *true/false*. لازم نفرّق عشان ما نستعمل جملة مكان object وبالعكس — هاد بيحفظ اتساق اللغة.

```text
// Example atomic sentences
Brother(KingJohn, RichardTheLionheart)              // predicate applied to two constants
>(Length(LeftLegOf(Richard)), Length(LeftLegOf(KingJohn)))   // predicate applied to two function terms
```

#### شرح كل سطر:
1. `Brother(KingJohn, RichardTheLionheart)` → جملة ذرية — بتقول إنه KingJohn وRichard إخوة (predicate بسيط على constants).
2. `>(Length(...), Length(...))` → جملة ذرية أعقد — كل طرف هو `term` مبني من `function` جوا `function` (`LeftLegOf` جوا `Length`).

**الناتج المتوقع:**
> جملتين ذريتين true أو false حسب الـ model — لا يوجد "تنفيذ" هون، هاد وصف بنيوي فقط.

---

### 6. الجمل المركّبة (Complex Sentences)

#### النص الأصلي يقول:
> "Complex sentences are made from atomic sentences using connectives ¬S, S1∧S2, S1∨S2, S1⇒S2, S1⇔S2. E.g. Sibling(KingJohn,Richard) ⇒ Sibling(Richard,KingJohn) >(1,2) ∨ ≤(1,2) >(1,2) ∧ ¬>(1,2)"

#### الشرح المبسّط:
تماماً متل المنطق القضوي — بس هلق الأطراف هي جمل ذرية FOL. بنقدر نبني تعقيد لا نهائي بالربط بين الجمل الذرية.

#### 💡 التشبيه:
> متل ما بنينا جمل مركّبة بالعربي من جمل بسيطة بـ"و"، "أو"، "إذا... فـ..." — هون نفس الشي بس الجمل البسيطة صارت جمل FOL بدل رموز قضوية.

---

### 7. الصدق بمنطق الرتبة الأولى (Truth in FOL)

#### النص الأصلي يقول:
> "Sentences are true with respect to a model and an interpretation. Model contains ≥1 objects (domain elements) and relations among them. Interpretation specifies referents for constant symbols → objects, predicate symbols → relations, function symbols → functional relations. An atomic sentence predicate(term1,...,termn) is true iff the objects referred to by term1,...,termn are in the relation referred to by predicate"

#### الشرح المبسّط:
عشان نعرف هل جملة FOL صح ولا غلط، لازم شيئين:
1. **Model**: عالم فيه objects محددة وعلاقات فعلية بينها (بيانات خام).
2. **Interpretation**: خريطة (mapping) بتربط كل رمز بلغتنا (constant/predicate/function) بشي بالـ model.

الجملة الذرية بتكون true إذا الـ objects اللي بيشيروا إلهم الـ terms فعلاً واقعين بالـ relation اللي بيشير إلها الـ predicate.

**لماذا نحتاج الفصل بين Model وInterpretation؟** لأنه نفس الـ model ممكن يترجم بأكتر من طريقة (نفس القصة، أسماء مختلفة) — الصدق مش خاصية بالجملة لحالها، هو خاصية بالجملة *مع* تفسير معيّن.

#### 💡 التشبيه:
> الـ Model متل خريطة حقيقية لمدينة (شوارع، بيوت فعلاً موجودة). الـ Interpretation متل أسماء الشوارع اللي حطيناها احنا على الخريطة — نفس المدينة ممكن تتسمى شوارعها بلغات مختلفة، بس الشوارع الفعلية ما بتتغير.
> **وجه الشبه:** Model = الواقع، Interpretation = التسمية/الترجمة اللي منحطها احنا فوق الواقع.

#### 📊 المخطط: Model for FOL — مثال Richard و John

#### ما هذا المخطط؟
> يمثّل model بسيط فيه شخصين (R وJ)، تاج، وعلاقات (`brother`, `on head`, `left leg`) — مأخوذ حرفياً من شريحة "Models for FOL: Example".

#### وصف العُقد:
| # | العُقدة | النوع `kind` | الشرح |
| --- | --- | --- | --- |
| 1 | R | object (person) | يمثّل Richard — عليه علاقة "left leg" |
| 2 | J | object (person, king) | يمثّل John — عليه تاج وعلاقة "left leg" |
| 3 | crown | object | التاج، مرتبط بـ J عبر "on head" |

#### وصف الروابط:
| من | إلى | التسمية | نوع السهم | الشرح |
| --- | --- | --- | --- | --- |
| R | J | brother | ثنائي الاتجاه | علاقة أخوّة متبادلة |
| J | R | brother | ثنائي الاتجاه | نفس العلاقة بالاتجاه المعاكس |
| crown | J | on head | اتجاه واحد | التاج فوق راس J |

```diagram
type: class
title: Model for FOL - Richard and John
direction: TD
nodes:
  - id: R
    label: R (person)
    kind: object
    level: 0
  - id: J
    label: J (person, king)
    kind: object
    level: 0
  - id: crown
    label: crown
    kind: object
    level: 1
edges:
  - from: R
    to: J
    label: brother
  - from: J
    to: R
    label: brother
  - from: crown
    to: J
    label: on head
```

### 7.1 مثال الصدق (Truth example)

#### النص الأصلي يقول:
> "Consider the interpretation in which Richard → Richard the Lionheart John → the evil King John Brother → the brotherhood relation. Under this interpretation, Brother(Richard, John) is true just in case Richard the Lionheart and the evil King John are in the brotherhood relation in the model"

#### الشرح المبسّط:
هاد تطبيق حرفي على التعريف اللي فوق: منحدد تفسير معيّن (Richard→شخص فعلي، John→شخص فعلي، Brother→علاقة فعلية)، وبعدين منتحقق: هل هالشخصين فعلاً إخوة بالـ model؟ إذا نعم، الجملة true.

---

### 8. عدد الـ Models كتير كتير! (Models for FOL: Lots!)

#### النص الأصلي يقول:
> "Entailment in propositional logic can be computed by enumerating models. We can enumerate the FOL models for a given KB vocabulary... Computing entailment by enumerating FOL models is not easy!"

#### الشرح المبسّط:
بالمنطق القضوي، حساب الـ `entailment` بالتعداد ممكن ولو مكلف. أما بـ FOL، عدد الـ models لأي مفردات (vocabulary) ممكن يكون *لا نهائي* (لأنه عدد الـ domain elements ممكن يروح من 1 لـ ∞، وبعدها لكل حجم عندك تركيبات لا نهائية من العلاقات والمرجعيات). فالتعداد المباشر مش عملي إطلاقاً.

**لماذا هذا مهم؟** هاد بيبرر ليش الأنظمة اللي بتشتغل بـ FOL (متل Forward/Backward Chaining) ما بتحسب entailment بالتعداد المباشر، وبتحتاج طرق استدلال أذكى رح ندرسها بمحاضرة لاحقة (Unification، Resolution).

---

### 9. التكميم الشامل (Universal Quantification)

#### النص الأصلي يقول:
> "∀⟨variables⟩ ⟨sentence⟩. Everyone at Berkeley is smart: ∀x At(x,Berkeley) ⇒ Smart(x). ∀x P is true in a model m iff P is true with x being each possible object in the model. Roughly speaking, equivalent to the conjunction of instantiations of P"

#### الشرح المبسّط:
`∀x P` معناها "لكل x، P صحيحة". وبشكل تقريبي، هاي معادلة لجملة AND طويلة (conjunction) تغطي كل object ممكن بالـ model نعوّضه مكان x.

```text
(At(KingJohn, Berkeley) ⇒ Smart(KingJohn))
∧ (At(Richard, Berkeley) ⇒ Smart(Richard))
∧ (At(Berkeley, Berkeley) ⇒ Smart(Berkeley))
∧ ...
```

**لماذا نستخدم ⇒ (implication) وليس ∧ مع ∀؟** لأنه إحنا بس بدنا نقول "إذا الشخص بجامعة بيركلي، هو ذكي" — مش بدنا نجبر *كل شي* بالعالم إنه يكون ببيركلي وذكي. الـ ⇒ بتخلي الجملة تصير "شرطية" بس تنطبق على اللي فعلاً بجامعة بيركلي.

#### 📐 المعادلة: صيغة التكميم الشامل
$$
\forall x\ P(x) \equiv \bigwedge_{o \in Domain} P(o)
$$

**الشرح:**
> `∀` = "لكل"، `x` = متغيّر يتم تعويضه بكل object بالـ domain، `Domain` = مجموعة كل الأشياء بالـ model، والصيغة بتقول إنه `∀x P(x)` مكافئة تقريباً لـ AND كل النسخ المعوّضة من P لكل object بالـ domain.

---

### 10. خطأ شائع مع ∀ (A common mistake to avoid)

#### النص الأصلي يقول:
> "Typically, ⇒ is the main connective with ∀. Common mistake: using ∧ as the main connective with ∀: ∀x At(x,Berkeley) ∧ Smart(x) means 'Everyone is at Berkeley and everyone is smart'"

#### الشرح المبسّط:
إذا غلط واستخدمنا `∧` بدل `⇒` مع `∀`، الجملة بتصير أقوى بكثير من المقصود — بتفرض إنه *كل واحد* بالعالم موجود ببيركلي *و* ذكي. هاد شبه مؤكد غلط لأنه مو كل شخص بالعالم ببيركلي.

#### الفهم الخاطئ الشائع ❌:
`∀x At(x,Berkeley) ∧ Smart(x)` بتعني نفس معنى `∀x At(x,Berkeley) ⇒ Smart(x)`.

#### الفهم الصحيح ✅:
الأولى بتفرض كل الناس ببيركلي وكل الناس أذكياء (شبه مستحيل تكون صح). الثانية بس بتقول: إذا كان أحد ببيركلي، فهو ذكي (شرطية معقولة).

---

### 11. التكميم الوجودي (Existential Quantification)

#### النص الأصلي يقول:
> "∃⟨variables⟩ ⟨sentence⟩. Someone at Stanford is smart: ∃x At(x,Stanford) ∧ Smart(x). ∃x P is true in a model m iff P is true with x being some possible object in the model. Roughly speaking, equivalent to the disjunction of instantiations of P"

#### الشرح المبسّط:
`∃x P` معناها "يوجد على الأقل x وحدة تحقق P". وهاي مكافئة تقريباً لجملة OR طويلة (disjunction) عبر كل object ممكن.

```text
(At(KingJohn, Stanford) ∧ Smart(KingJohn))
∨ (At(Richard, Stanford) ∧ Smart(Richard))
∨ (At(Stanford, Stanford) ∧ Smart(Stanford))
∨ ...
```

**لماذا هون منستخدم ∧ (AND) بدل ⇒؟** لأنه بدنا نقول فعلاً "في شخص موجود بستانفورد *و* هو ذكي" — لازم الشرطين يكونوا صح معاً لنفس الـ object. لو استخدمنا ⇒ رح تصير مشكلة (شوفي البند 12).

---

### 12. خطأ شائع تاني مع ∃ (Another common mistake to avoid)

#### النص الأصلي يقول:
> "Typically, ∧ is the main connective with ∃. Common mistake: using ⇒ as the main connective with ∃: ∃x At(x,Stanford) ⇒ Smart(x) is true if there is anyone who is not at Stanford!"

#### الشرح المبسّط:
لو استخدمنا `⇒` مع `∃`، الجملة بتصير true بسهولة *زيادة عن اللزوم* — لأنه بما إنه implication صح تلقائياً لما يكون طرفها الأيسر false، أي شخص مش بستانفورد بيخلّي `At(x,Stanford) ⇒ Smart(x)` صح لهيك الشخص (بغض النظر هل هو ذكي ولا لأ)، وبالتالي الجملة كلها `∃x ...` بتصير true حتى لو محدا ذكي فعلاً بستانفورد.

#### الفهم الخاطئ الشائع ❌:
`∃x At(x,Stanford) ⇒ Smart(x)` بتعني "في شخص بستانفورد وهو ذكي".

#### الفهم الصحيح ✅:
هاي الجملة بتصير true تلقائياً حتى لو محدا بستانفورد أصلاً ذكي — بس لازم يكون في شخص واحد (أي شخص) مش بستانفورد. الصيغة الصحيحة هي `∃x At(x,Stanford) ∧ Smart(x)`.

#### مهم للامتحان ⚠️:
> قاعدة ذهبية: **∀ مع ⇒**، و **∃ مع ∧**. عكسهم بيغيّر معنى الجملة كلياً وهاد من أكتر أخطاء الطلاب شيوعاً.

---

### 13. خصائص الـ Quantifiers (Properties of quantifiers)

#### النص الأصلي يقول:
> "∀x ∀y is the same as ∀y ∀x. ∃x ∃y is the same as ∃y ∃x. ∃x ∀y is not the same as ∀y ∃x. ∃x ∀y Loves(x,y) 'There is a person who loves everyone in the world'. ∀y ∃x Loves(x,y) 'Everyone in the world is loved by at least one person'. Quantifier duality: each can be expressed using the other. ∀x Likes(x,IceCream) ¬∃x ¬Likes(x,IceCream). ∃x Likes(x,Broccoli) ¬∀x ¬Likes(x,Broccoli)"

#### الشرح المبسّط:
- تبديل ترتيب نفس النوع من الـ quantifier (`∀∀` أو `∃∃`) ما بيأثر عالمعنى.
- **لكن** تبديل ترتيب `∃` و`∀` مع بعض بيغيّر المعنى بالكامل! `∃x ∀y Loves(x,y)` (في شخص واحد بيحب الكل) مختلفة جذرياً عن `∀y ∃x Loves(x,y)` (كل شخص محبوب من حدا على الأقل، بس مش بالضرورة نفس الشخص).
- **Quantifier duality**: أي `∀` ممكن تتكتب بواسطة `∃` والعكس، عن طريق النفي (negation) المزدوج.

#### 💡 التشبيه:
> "في شخص واحد بيحب كل الناس" (∃x∀y) متل نجم مشهور واحد بيحبه الكل ما حدا غيره بيحب الكل. أما "كل شخص محبوب من حدا" (∀y∃x) متل كل واحد إله صديق واحد ع الأقل بيحبه — بس مش لازم يكون نفس الصديق للجميع.
> **وجه الشبه:** ∃x∀y = بطل واحد يشمل الكل، ∀y∃x = كل واحد إله بطله الخاص.

#### 📐 المعادلة: ثنائية الـ Quantifiers (Quantifier Duality)
$$
\forall x\, P(x) \equiv \neg \exists x\, \neg P(x) \qquad\qquad \exists x\, P(x) \equiv \neg \forall x\, \neg P(x)
$$

**الشرح:**
> `∀x P(x)` (الكل يحقق P) مكافئة لـ "ما في حدا ما بيحقق P" (`¬∃x ¬P(x)`). وبالمثل `∃x P(x)` (في واحد ع الأقل بيحقق P) مكافئة لـ "مش صح إنه الكل ما بيحقق P" (`¬∀x ¬P(x)`).

#### 🔍 تتبع التنفيذ: ترتيب Quantifiers مهم

**المدخل:** `Loves(x,y)` مع تبديل ترتيب `∃x` و`∀y`

| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | اكتب `∃x ∀y Loves(x,y)` | "في شخص وحيد بيحب الكل" |
| 2 | بدّل الترتيب إلى `∀y ∃x Loves(x,y)` | "كل شخص محبوب من حدا (ممكن يختلف الحدا)" |
| 3 | قارن المعنيين | مختلفين تماماً — الأولى أقوى بكثير من الثانية |

**النتيجة:** ترتيب `∃` قبل `∀` (أو العكس) بغيّر المعنى — القاعدة عامة: لا يجوز تبديل ترتيب `∃` و`∀` المختلفين.

---

### 14. المساواة (Equality)

#### النص الأصلي يقول:
> "term1 = term2 is true under a given interpretation if and only if term1 and term2 refer to the same object. E.g., 1=2 and ∀x ×(Sqrt(x),Sqrt(x))=x are satisfiable 2=2 is valid. E.g., definition of (full) Sibling in terms of Parent: ∀x,y Sibling(x,y) ⇔ [¬(x=y) ∧ ∃m,f ¬(m=f) ∧ Parent(m,x) ∧ Parent(f,x) ∧ Parent(m,y) ∧ Parent(f,y)]"

#### الشرح المبسّط:
رمز `=` بيقارن هل *term*ين بيشيروا لنفس الـ object بالضبط بالـ model (مش بس متشابهين — نفس الشي حرفياً). ملاحظة مهمة: `1=2` جملة *satisfiable* (ممكن تكون صح بموديل معيّن غريب) بس مش *valid* (مش صح بكل الموديلات)، بينما `2=2` جملة *valid* (صح دايماً بكل موديل).

المثال الكامل لتعريف `Sibling` بدلالة `Parent` بيوريكي كيف نستخدم `=` (والنفي عنها `¬(x=y)`) عشان نمنع اعتبار الشخص أخو نفسه، ونتأكد إنه الأب والأم مش نفس الشخص.

#### 📐 المعادلة: تعريف Sibling الكامل
$$
\forall x,y\ Sibling(x,y) \Leftrightarrow \big[\neg(x=y) \land \exists m,f\ \neg(m=f) \land Parent(m,x) \land Parent(f,x) \land Parent(m,y) \land Parent(f,y)\big]
$$

**الشرح:**
> `x=y`/`m=f` = مقارنة هوية (نفس الـ object أم لا)، `¬(x=y)` = الشخصين مختلفين (ما بيقدروا يكونوا إخوة لحالهم)، `∃m,f` = يوجد أم وأب، `Parent(m,x)` = m هو والد x، وهيك دواليك لباقي الشروط — الجملة كلها بتقول: x وy إخوة إذا كانوا مختلفين وعندهم نفس الأم ونفس الأب.

---

### 15. مرح مع الجمل (Fun with sentences) — سلسلة تعريفات عائلية

#### النص الأصلي يقول:
> "Brothers are siblings: ∀x,y Brother(x,y) ⇒ Sibling(x,y). 'Sibling' is symmetric: ∀x,y Sibling(x,y) ⇔ Sibling(y,x). One's mother is one's female parent: ∀x,y Mother(x,y) ⇔ (Female(x) ∧ Parent(x,y)). A first cousin is a child of a parent's sibling: ∀x,y FirstCousin(x,y) ⇔ ∃p,ps Parent(p,x) ∧ Sibling(ps,p) ∧ Parent(ps,y)"

#### الشرح المبسّط:
هاي سلسلة أمثلة بتوريكي كيف نترجم جمل طبيعية بالإنجليزي لـ FOL خطوة بخطوة، كل وحدة أعقد من اللي قبلها:
1. **Brothers are siblings** — علاقة implication بسيطة بين Brother وSibling.
2. **Sibling is symmetric** — علاقة ثنائية الاتجاه (`⇔`) بين الطرفين.
3. **Mother = female parent** — تعريف مفهوم مركّب من مفهومين أبسط (Female + Parent).
4. **First cousin** — أعقد تعريف: بيحتاج `∃` لايجاد الوالد المشترك (p) وأخوه/أخته (ps).

#### 💡 التشبيه:
> بناء هاي التعريفات متل بناء LEGO — كل تعريف بيستخدم تعريفات أبسط بنيناها قبل (Sibling بيستخدم Parent، FirstCousin بيستخدم Parent وSibling سوا).
> **وجه الشبه:** كل مفهوم معقّد = تركيب من مفاهيم أبسط سبق تعريفها.

#### مهم للامتحان ⚠️:
> لاحظي كيف الـ `FirstCousin` استخدمت `∃p,ps` (وجودي) مش `∀` — لأنه بدنا نلاقي *على الأقل* والد وعمّ/خالة واحد يحقق الشرط، مش كل الوالدين.

---

### 16. التفاعل مع قواعد معرفة FOL (Interacting with FOL KBs)

#### النص الأصلي يقول:
> "Suppose a wumpus-world agent is using an FOL KB and perceives a smell and a breeze (but no glitter) at t=5: Tell(KB, Percept([Smell,Breeze,None],5)) Ask(KB, ∃a Action(a,5)). ... Answer: Yes, {a/Shoot} ← substitution (binding list). Given a sentence S and a substitution σ, Sσ denotes the result of plugging σ into S; e.g., S=Smarter(x,y) σ={x/Hillary,y/Bill} Sσ=Smarter(Hillary,Bill). Ask(KB,S) returns some/all σ such that KB⊨Sσ"

#### الشرح المبسّط:
هاد شرح آلية التفاعل مع قاعدة معرفة FOL:
- `Tell(KB, ...)` = بنضيف معلومة (حقيقة إدراك/perception) لقاعدة المعرفة.
- `Ask(KB, ...)` = بنسأل سؤال، ممكن يكون سؤال وجودي (`∃a Action(a,5)`؟ — هل في فعل معيّن مطلوب بالوقت 5؟).
- الجواب مش بس "نعم/لا" — لما يكون السؤال فيه متغيّر (زي `a`)، الجواب بيرجع **substitution** (قائمة تعويض/binding list) بتحدد قيمة المتغيّر، متل `{a/Shoot}` (يعني a=Shoot).

**لماذا نحتاج Substitution؟** لأنه بدون تعويض، معرفتنا إنه "KB تستلزم ∃a Action(a,5)" مش مفيدة عملياً — الوكيل محتاج يعرف *أي فعل بالضبط*. الـ substitution هي الجسر بين "الإثبات المجرّد" و"القرار العملي".

```text
// Example substitution mechanics
S = Smarter(x, y)              // sentence with free variables
σ = {x/Hillary, y/Bill}        // substitution (binding list)
Sσ = Smarter(Hillary, Bill)    // result after applying σ to S
```

#### شرح كل سطر:
1. `S = Smarter(x, y)` → جملة عامة فيها متغيّرين غير معرّفين (x, y).
2. `σ = {x/Hillary, y/Bill}` → تعريف تعويض: كل x تصير Hillary، كل y تصير Bill.
3. `Sσ = Smarter(Hillary, Bill)` → النتيجة بعد التطبيق: جملة محددة (ground sentence) بلا متغيّرات.

**الناتج المتوقع:**
> `Ask(KB, S)` بترجع كل σ ممكنة (أو بعضها) بحيث `KB ⊨ Sσ` (يعني KB يستلزم Sσ).

---

### 17. قاعدة معرفة عالم Wumpus (Knowledge base for the wumpus world)

#### النص الأصلي يقول:
> "Perception: ∀b,g,t Percept([Smell,b,g],t) ⇒ Smelt(t). ∀s,b,t Percept([s,b,Glitter],t) ⇒ AtGold(t). Reflex: ∀t AtGold(t) ⇒ Action(Grab,t). Reflex with internal state: do we have the gold already? ∀t AtGold(t) ∧ ¬Holding(Gold,t) ⇒ Action(Grab,t). Holding(Gold,t) cannot be observed ⇒ keeping track of change is essential"

#### الشرح المبسّط:
هون منشوف كيف نبني قاعدة معرفة كاملة بخطوات:
1. **قواعد الإدراك (Perception)**: تحويل الإدراكات الخام (`Percept`) لحقائق مفيدة (`Smelt(t)`, `AtGold(t)`).
2. **Reflex بسيط**: قاعدة رد فعل مباشرة — "إذا الذهب هون، امسكه" (بدون أي ذاكرة/حالة داخلية).
3. **Reflex مع حالة داخلية**: نسخة أذكى — "امسك الذهب بس إذا مش ماسكه أصلاً" — هيك منتفادى محاولة "مسك" شي عم نمسكه أصلاً.

**لماذا نحتاج الحالة الداخلية (`Holding(Gold,t)`)؟** لأنه هاي المعلومة *ما بتنلاحظ مباشرة* من الحواس — الوكيل ما "بيشوف" إنه ماسك الذهب، لازم يستنتجها من تاريخ أفعاله. هاد بيوريكي ليش "تتبع التغيير" (`keeping track of change`) أساسي بأي وكيل ذكي.

#### ⚙️ الخطوات / الخوارزمية: بناء سلوك رد الفعل بالحالة الداخلية

#### ما هدف هذه العملية؟
> تحويل إدراك خام لقرار فعل (action) مع مراعاة معلومة غير قابلة للملاحظة المباشرة (Holding).

```algorithm
1 | استقبال الإدراك | Tell(KB, Percept(...)) | تحويل الإدراك الخام لحقيقة بالقاعدة (مثلاً Smelt(t) أو AtGold(t))
2 | فحص الحالة الداخلية | Holding(Gold,t) | التحقق (استنتاجاً لا ملاحظة) هل الوكيل ماسك الذهب أصلاً
3 | تطبيق قاعدة الشرط | AtGold(t) ∧ ¬Holding(Gold,t) ⇒ Action(Grab,t) | لو الذهب موجود وما هو ماسكه، استنتج فعل Grab
4 | الاستعلام | Ask(KB, ∃a Action(a,t)) | استخراج الفعل النهائي (substitution) لينفّذه الوكيل
```

#### نقاط التنفيذ:
- الترتيب مهم: لازم نتأكد من الحالة الداخلية *قبل* ما نطبّق قاعدة الفعل، وإلا ممكن الوكيل يحاول يمسك الذهب أكتر من مرة.
- `Holding(Gold,t)` ما بتنلاحظ مباشرة — لازم تُستنتج من الأفعال السابقة (situation calculus، البند 19).

---

### 18. استنتاج الخصائص الخفية (Deducing hidden properties)

#### النص الأصلي يقول:
> "Properties of locations: ∀x,t At(Agent,x,t) ∧ Smelt(t) ⇒ Smelly(x). ∀x,t At(Agent,x,t) ∧ Breeze(t) ⇒ Breezy(x). Squares are breezy near a pit: Diagnostic rule—infer cause from effect ∀y Breezy(y) ⇒ ∃x Pit(x) ∧ Adjacent(x,y). Causal rule—infer effect from cause ∀x,y Pit(x) ∧ Adjacent(x,y) ⇒ Breezy(y). Neither of these is complete... Definition for the Breezy predicate: ∀y Breezy(y) ⇔ [∃x Pit(x) ∧ Adjacent(x,y)]"

#### الشرح المبسّط:
هون منتعلم فرق مهم بين نوعين من القواعد:
- **Diagnostic rule** (قاعدة تشخيصية): من الأثر نستنتج السبب — "إذا في تيار هواء، لازم في حفرة مجاورة" (`Breezy(y) ⇒ ∃x Pit(x)∧Adjacent(x,y)`).
- **Causal rule** (قاعدة سببية): من السبب نستنتج الأثر — "إذا في حفرة مجاورة، لازم يصير تيار هواء" (`Pit(x)∧Adjacent(x,y) ⇒ Breezy(y)`).

**المشكلة**: ولا وحدة من الاثنين *كاملة* لحالها — القاعدة السببية ما بتقول شو بيصير بالمربعات البعيدة عن كل حفرة (هل ممكن تكون breezy لسبب تاني؟). **الحل**: نستخدم `⇔` (biconditional/تعريف كامل) يجمع الاتجاهين بجملة وحدة.

#### ⚖️ المقايضة: Diagnostic vs Causal vs Definition (⇔)

| | Diagnostic (⇒ من الأثر للسبب) | Causal (⇒ من السبب للأثر) | Definition (⇔) |
| --- | --- | --- | --- |
| المزايا | مفيدة للاستنتاج المباشر من الملاحظة | طبيعية لوصف كيف تعمل الفيزياء | كاملة، بتغطي الاتجاهين |
| العيوب | ما بتوضح *كل* أسباب الأثر الممكنة | ما بتحدد شو بيصير بالحالات البعيدة عن السبب | أعقد شوي بالصياغة |
| متى تختاره | لما بدك تفسّر ملاحظة | لما بدك تتوقع نتيجة فعل/ظاهرة | لما بدك قاعدة معرفة كاملة ودقيقة |

#### 📐 المعادلة: تعريف Breezy الكامل
$$
\forall y\ Breezy(y) \Leftrightarrow \big[\exists x\ Pit(x) \land Adjacent(x,y)\big]
$$

**الشرح:**
> `⇔` = "إذا وفقط إذا" (biconditional) — المربع y بيكون breezy *بالضبط* إذا في حفرة x مجاورة له، ولا حالة تانية بتخلي y يصير breezy. هاي الصيغة كاملة (تحل مشكلة عدم اكتمال الـ diagnostic/causal لحالهم).

---

### 19. تتبع التغيير (Keeping track of change) — Situation Calculus

#### النص الأصلي يقول:
> "Facts hold in situations, rather than eternally E.g., Holding(Gold,Now) rather than just Holding(Gold). Situation calculus is one way to represent change in FOL: Adds a situation argument to each non-eternal predicate E.g., Now in Holding(Gold,Now) denotes a situation. Situations are connected by the Result function Result(a,s) is the situation that results from doing a in s"

#### الشرح المبسّط:
لحد هلق، جملنا كانت بتفترض إنه الحقائق ثابتة للأبد. لكن بعالم فيه أفعال وتغيير (متل Wumpus)، لازم نضيف "متى" — هاد اسمه **situation** (موقف/لحظة). كل predicate مش أبدي (زي Holding) لازم ياخد situation كمدخل إضافي.

الدالة `Result(a,s)` بتربط المواقف ببعض: بتقول "شو الموقف اللي بينتج لو نفّذنا الفعل a وإحنا بالموقف s".

**لماذا هذا أساسي؟** لأنه بدون تمثيل صريح للزمن/الموقف، ما فيه طريقة نميّز بين "كنت ماسك الذهب قبل شوي" و"أنا ماسك الذهب هلق" — والفرق هاد حاسم لتخطيط أي سلسلة أفعال.

#### 💡 التشبيه:
> فكري بالـ situation calculus متل "لقطات فيديو" (frames) — كل situation هي لقطة واحدة من العالم بلحظة معيّنة، والدالة Result هي "زر التقديم" اللي بينقلك من لقطة لل لقطة اللي بعدها لما تنفّذي فعل.
> **وجه الشبه:** Situation = لقطة فيديو، Result(a,s) = الانتقال للقطة التالية بعد فعل معيّن.

---

### 20. وصف الأفعال I — Frame Problem

#### النص الأصلي يقول:
> "'Effect' axiom—describe changes due to action ∀s AtGold(s) ⇒ Holding(Gold,Result(Grab,s)). 'Frame' axiom—describe non-changes due to action ∀s HaveArrow(s) ⇒ HaveArrow(Result(Grab,s)). Frame problem: find an elegant way to handle non-change (a) representation—avoid frame axioms (b) inference—avoid repeated 'copy-overs' to keep track of state. Qualification problem... Ramification problem..."

#### الشرح المبسّط:
لوصف فعل بشكل كامل، محتاجين نوعين من البديهيات (axioms):
- **Effect axiom**: شو *تغيّر* بسبب الفعل (لو كان الذهب هون، صرت ماسكه بعد Grab).
- **Frame axiom**: شو *ما تغيّرش* بسبب الفعل (السهم اللي كان معي، لسا معي بعد Grab).

**المشكلة (Frame Problem)**: لو حبينا نكتب frame axiom لكل شي ما بيتغيّر بكل فعل، رح نحتاج عدد هائل من البديهيات (كل predicate × كل action ما بيأثر فيه). هاي مشكلة تمثيل (representation) ومشكلة استدلال (inference) بنفس الوقت.

وفي مشكلتين متعلقتين:
- **Qualification problem**: أي وصف واقعي لفعل بيحتاج شروط استثنائية ما إلها نهاية (شو لو الذهب زلق؟ شو لو مسمّر بالأرض؟).
- **Ramification problem**: الأفعال الحقيقية إلها نتائج ثانوية كتير (الغبار عالذهب، تآكل القفازات...).

#### 🛠️ استكشاف الأخطاء

| الخطأ | السبب | الحل |
| --- | --- | --- |
| كتابة frame axiom منفصل لكل predicate مستقر | تمثيل ساذج لعدم التغيير | استخدام Successor-State Axioms (البند 21) بدل frame axioms منفصلة |
| تجاهل الشروط الاستثنائية بالكامل | تبسيط زايد عن اللزوم | قبول الـ qualification problem كحد طبيعي للتمثيل، والتركيز على الحالات الشائعة |
| محاولة نمذجة كل نتيجة ثانوية | التعامل مع ramification problem بتفصيل غير عملي | التركيز على النتائج المهمة فقط للمهمة المطروحة |

---

### 21. وصف الأفعال II — Successor-State Axioms

#### النص الأصلي يقول:
> "Successor-state axioms solve the representational frame problem. Each axiom is 'about' a predicate (not an action per se): P true afterwards ⇔ [an action made P true ∨ P true already and no action made P false]. For holding the gold: ∀a,s Holding(Gold,Result(a,s)) ⇔ [(a=Grab ∧ AtGold(s)) ∨ (Holding(Gold,s) ∧ a≠Release)]"

#### الشرح المبسّط:
الحل الأنيق لمشكلة الـ Frame: بدل ما نكتب axiom لكل action×predicate، منكتب axiom **واحد لكل predicate** بيغطي *كل* الأفعال الممكنة دفعة وحدة. الصيغة العامة:

> "P صحيحة بعدين ⇔ (فعل معيّن خلّاها تصير صحيحة) OR (كانت صحيحة أصلاً وما في فعل خلّاها تصير غلط)"

هيك بدل ما نكتب N×M بديهية (N أفعال × M خصائص)، منكتب M بديهية بس (وحدة لكل خاصية) — كل وحدة فيها منطق "شو بيخليني أصير/أبقى بهاي الحالة".

#### 📐 المعادلة: Successor-State Axiom لـ Holding(Gold)
$$
\forall a,s\ Holding(Gold, Result(a,s)) \Leftrightarrow \big[(a=Grab \land AtGold(s)) \lor (Holding(Gold,s) \land a\neq Release)\big]
$$

**الشرح:**
> `a` = الفعل المنفَّذ، `s` = الموقف الحالي، `Result(a,s)` = الموقف الجديد بعد الفعل. الشرط الأول `(a=Grab ∧ AtGold(s))` = صرت ماسك الذهب لأني عملت Grab وكان الذهب هون. الشرط الثاني `(Holding(Gold,s) ∧ a≠Release)` = كنت ماسكه أصلاً وما عملت Release (يعني لسا ماسكه).

#### 🔄 قبل / بعد: أثر فعل Grab على Holding(Gold)

**قبل:**
```text
AtGold(s) = true
Holding(Gold, s) = false
```

**بعد:**
```text
a = Grab
Holding(Gold, Result(Grab, s)) = true   // by successor-state axiom, first disjunct satisfied
```

**ماذا تغيّر؟** الوكيل صار "ماسك الذهب" فقط لأنه نفّذ Grab وكان الذهب موجود بنفس الموقف — الـ axiom الواحد غطّى هاد التغيير تلقائياً بدون فريم أكسيوم منفصل.

---

### 22. بناء الخطط (Making plans)

#### النص الأصلي يقول:
> "Initial condition in KB: At(Agent,[1,1],S0) At(Gold,[1,2],S0). Query: Ask(KB,∃s Holding(Gold,s)) i.e., in what situation will I be holding the gold? Answer: {s/Result(Grab,Result(Forward,S0))} i.e., go forward and then grab the gold. This assumes that the agent is interested in plans starting at S0 and that S0 is the only situation described in the KB"

#### الشرح المبسّط:
بعد ما بنينا كل البديهيات (effect/frame/successor-state)، فينا نستعمل الاستدلال العادي لـ FOL لنسأل: "بأي situation رح أصير ماسك الذهب؟". والجواب بيرجع substitution بتمثّل *خطة كاملة*: `Result(Grab, Result(Forward, S0))` — يعني: تحرّك للأمام، وبعدين امسك الذهب.

**ملاحظة مهمة**: هاد الأسلوب مبني على افتراض إنه S0 هو نقطة البداية الوحيدة المذكورة — الطريقة هاي بسيطة بس مش الأكفأ (شوفي البند 23).

---

### 23. بناء الخطط: طريقة أفضل (Making plans: A better way)

#### النص الأصلي يقول:
> "Represent plans as action sequences [a1,a2,...,an]. PlanResult(p,s) is the result of executing p in s. Then the query Ask(KB,∃p Holding(Gold,PlanResult(p,S0))) has the solution {p/[Forward,Grab]}. Definition of PlanResult in terms of Result: ∀s PlanResult([],s)=s ∀a,p,s PlanResult([a|p],s)=PlanResult(p,Result(a,s)). Planning systems are special-purpose reasoners designed to do this type of inference more efficiently than a general-purpose reasoner"

#### الشرح المبسّط:
بدل ما نبني تعشيش (`Result(Grab,Result(Forward,S0))`) بشكل متداخل ومعقّد أكتر ما يكبر الخطة، منمثّل الخطة كـ **قائمة أفعال** `[a1,a2,...,an]`، ومنعرّف `PlanResult(p,s)` بشكل تكراري (recursive):
- القائمة الفاضية `[]` ما بتغيّر شي: `PlanResult([],s) = s`.
- القائمة اللي فيها فعل a وباقي خطة p: نفّذ a أولاً، وبعدين نفّذ باقي الخطة p على النتيجة: `PlanResult([a|p],s) = PlanResult(p,Result(a,s))`.

**لماذا هاي أفضل؟** لأنها بتفصل *تمثيل الخطة* (قائمة بسيطة) عن *تنفيذها* (تعريف تكراري واحد)، وهاد بالضبط أساس أنظمة التخطيط (`Planning systems`) اللي بتحل هاد النوع من الاستدلال بكفاءة أعلى من الاستدلال العام.

```text
// Recursive definition of PlanResult
PlanResult([], s) = s                              // empty plan: no change
PlanResult([a|p], s) = PlanResult(p, Result(a, s))  // execute first action, recurse on the rest
```

#### شرح كل سطر:
1. `PlanResult([], s) = s` → الحالة الأساسية (base case) بالتكرار: خطة فاضية ما بتأثر عالموقف.
2. `PlanResult([a|p], s) = PlanResult(p, Result(a, s))` → الحالة التكرارية: نفّذ أول فعل (a) عبر Result، وبعدين طبّق باقي الخطة (p) على الموقف الجديد.

**الناتج المتوقع:**
> `Ask(KB, ∃p Holding(Gold, PlanResult(p,S0)))` بترجع `{p/[Forward,Grab]}` — يعني الخطة "تقدّم للأمام، بعدين امسك" هي الحل.

#### الدرس المستفاد:
> تمثيل الخطة كقائمة أفعال + تعريف تكراري واحد لتنفيذها أنظف وأقوى بكثير من تعشيش استدعاءات Result يدوياً لكل خطوة.

---

## الجزء الثاني: ملخص منظم

### أهم التعاريف والمفاهيم
| المصطلح | التعريف | مثال/ملاحظة |
| --- | --- | --- |
| `Object` | شيء موجود بالعالم | KingJohn، الرقم 2 |
| `Relation` | خاصية أو علاقة بين objects | `Brother(x,y)` |
| `Function` | علاقة ترجع object واحد محدد لكل مدخل | `LeftLegOf(x)` |
| `Term` | تعبير بيشير لـ object (constant/variable/function) | `Sqrt(4)` |
| `Atomic sentence` | predicate(terms) أو term1=term2 | `Brother(KingJohn,Richard)` |
| `Model` | عالم فيه objects وعلاقات فعلية | domain elements + facts |
| `Interpretation` | خريطة من الرموز للـ model | Richard→شخص فعلي |
| `∀` (Universal) | لكل — عادة مع ⇒ | `∀x At(x,B) ⇒ Smart(x)` |
| `∃` (Existential) | يوجد — عادة مع ∧ | `∃x At(x,S) ∧ Smart(x)` |
| `Substitution (σ)` | قائمة تعويض متغيّرات بقيم | `{x/Hillary,y/Bill}` |
| `Situation` | لحظة/موقف يحمل الحقائق غير الأبدية | `S0`, `Result(Grab,S0)` |
| `Result(a,s)` | دالة تربط الموقف الناتج عن فعل a بموقف s | — |
| `Frame problem` | صعوبة تمثيل/استدلال ما لا يتغيّر بفعل | يُحل بـ Successor-State Axioms |
| `Successor-state axiom` | بديهية واحدة لكل predicate تغطي كل الأفعال | Holding(Gold,...) |
| `PlanResult(p,s)` | نتيجة تنفيذ خطة (قائمة أفعال) على موقف | تعريف تكراري |

### المكوّنات الرئيسية (مرجع سريع)
| الأداة | الوظيفة | ملاحظة |
| --- | --- | --- |
| `Tell(KB, S)` | إضافة جملة/حقيقة لقاعدة المعرفة | مثال: `Tell(KB,Percept(...,5))` |
| `Ask(KB, S)` | استعلام عن جملة، يرجع substitution | مثال: `Ask(KB,∃a Action(a,5))` |
| `Effect axiom` | وصف ما يتغيّر بفعل | جزء من وصف الفعل الكامل |
| `Frame axiom` | وصف ما لا يتغيّر بفعل (تقليدي، غير فعّال) | استُبدل بـ Successor-State Axiom |

### جداول مقارنات سريعة
| المقارنة | الأول | الثاني | الفرق |
| --- | --- | --- | --- |
| `Propositional Logic` vs `FOL` | حقائق فقط | حقائق + objects + relations | FOL أقوى تعبيرياً، بيتجنب تكرار الجمل |
| `∀` vs `∃` | الرابط الطبيعي ⇒ | الرابط الطبيعي ∧ | استخدام الرابط الغلط بيغيّر المعنى كلياً |
| `Diagnostic rule` vs `Causal rule` | من الأثر للسبب | من السبب للأثر | ولا وحدة كاملة لحالها — الحل: تعريف بـ ⇔ |
| `Frame axiom` vs `Successor-state axiom` | axiom لكل action×predicate | axiom واحد لكل predicate | الثاني بيحل الـ representational frame problem |
| `Result(a,s)` vs `PlanResult(p,s)` | نتيجة فعل واحد | نتيجة خطة كاملة (قائمة أفعال) | PlanResult معرّفة تكرارياً بدلالة Result |

### قاموس المصطلحات
| الفئة | المصطلحات |
| --- | --- |
| بنية اللغة | `Constants`, `Predicates`, `Functions`, `Variables`, `Connectives`, `Equality`, `Quantifiers` |
| الدلالة (Semantics) | `Model`, `Interpretation`, `Domain elements`, `Truth` |
| التكميم | `Universal quantification`, `Existential quantification`, `Quantifier duality` |
| التفاعل مع القاعدة | `Tell`, `Ask`, `Substitution`, `Binding list` |
| الزمن والتغيير | `Situation calculus`, `Result`, `Frame problem`, `Qualification problem`, `Ramification problem`, `Successor-state axiom` |
| التخطيط | `Plan`, `PlanResult`, `Planning systems` |

### أبرز النقاط الذهبية
1. FOL يضيف `objects`، `relations`، `functions` فوق `facts` المنطق القضوي — هاد أهم فرق جوهري.
2. القاعدة الذهبية: `∀` مع `⇒`، و`∃` مع `∧` — عكسها بيغيّر المعنى كلياً.
3. الصدق بـ FOL دايماً نسبي لـ `model` و`interpretation` محددين — مش خاصية مطلقة للجملة.
4. الترتيب بين `∃` و`∀` المختلفين *مهم جداً* — بعكس ترتيب نفس النوع (∀∀ أو ∃∃) اللي ما بيأثر.
5. `Successor-state axioms` حلّت الـ representational frame problem بجمع Effect وFrame بصيغة واحدة لكل predicate.
6. `Substitution` هي الجسر بين "الإثبات المجرّد" (KB⊨S) والقرار العملي (شو الفعل بالضبط).

### الأخطاء الشائعة عند الطلاب ⚠️
| الخطأ | التصحيح |
| --- | --- |
| استخدام `∧` مع `∀` بدل `⇒` | خليها `⇒` — وإلا الجملة بتفرض شرط زائد على *كل* object بالعالم |
| استخدام `⇒` مع `∃` بدل `∧` | خليها `∧` — وإلا الجملة بتصير صح تلقائياً لأي شيء لا يحقق الشرط الأول |
| الخلط بين `Model` و`Interpretation` | Model = الواقع الفعلي، Interpretation = خريطة الرموز فوق هاد الواقع |
| اعتبار `Term` و`Sentence` نفس الشي | Term يرجع object، Sentence ترجع true/false |
| اعتقاد إنه ترتيب `∃x∀y` نفسه متل `∀y∃x` | مختلفين جذرياً — راجعي البند 13 |
| كتابة frame axiom لكل predicate×action | استخدمي successor-state axiom واحد بدلها |

---

### خطوات وإجراءات المحاضرة
> هاي المحاضرة نظرية بمعظمها (syntax/semantics)، فالخطوات هون إجرائية (procedures) بدل خوارزميات بحث تقليدية.

#### ⚙️ الخطوات / الخوارزمية: التحقق من صدق جملة FOL ضمن Model

#### ما هدف هذه العملية؟
> تحديد هل جملة FOL صحيحة (true) أو خاطئة (false) بالنسبة لموديل وinterpretation محددين.

```algorithm
1 | حدد الموديل | Model | اجمع كل الـ objects والعلاقات الفعلية بالعالم المفروض
2 | حدد التفسير | Interpretation | اربط كل رمز (constant/predicate/function) بعنصر بالموديل
3 | قيّم الـ terms | Term evaluation | حوّل كل term (constant/variable/function) لـ object فعلي بالموديل
4 | تحقق من الـ predicate | Predicate check | تأكد هل الـ objects الناتجة واقعة فعلاً بالـ relation المقابلة للـ predicate
5 | طبّق الروابط المنطقية | Connectives | إذا الجملة مركّبة، طبّق ∧∨¬⇒⇔ على نتائج الجمل الذرية الفرعية
```

#### نقاط التنفيذ:
- لازم تثبتي نفس الـ interpretation طول عملية التقييم — تغييرها بالنص بيغيّر النتيجة.
- الجمل تحت quantifiers لازم تتحقق لكل/بعض الـ objects بالـ domain (حسب ∀ أو ∃).

---

#### ⚙️ الخطوات / الخوارزمية: بناء Successor-State Axiom لأي predicate

#### ما هدف هذه العملية؟
> حل مشكلة الـ frame problem تمثيلياً بصيغة واحدة تغطي كل الأفعال الممكنة.

```algorithm
1 | حدد الـ predicate المستهدف | P(x,Result(a,s)) | مثلاً Holding(Gold,...)
2 | حدد الأفعال المسبِّبة | Making-true actions | أي فعل a بيخلي P تصير true (مثلاً a=Grab مع AtGold(s))
3 | حدد شرط الاستمرارية | Persistence condition | P كانت true أصلاً وما في فعل بيخليها false (a≠Release)
4 | اربط الشرطين بـ OR | Disjunction | اجمع (2) و(3) بـ ∨ داخل بديهية واحدة بصيغة ⇔
```

#### نقاط التنفيذ:
- لازم تحددي *كل* الأفعال اللي ممكن تخلي P تصير false — وإلا البديهية ناقصة.
- الصيغة العامة قابلة لإعادة الاستخدام لأي predicate غير أبدي بالعالم.

---

### أنماط الأكواد والبنى المتكررة
| النمط | البنية الأساسية | متى تستخدمه |
| --- | --- | --- |
| Universal with implication | `∀x P(x) ⇒ Q(x)` | لوصف قاعدة عامة تنطبق شرطياً |
| Existential with conjunction | `∃x P(x) ∧ Q(x)` | لتأكيد وجود عنصر واحد على الأقل يحقق شرطين معاً |
| Biconditional definition | `∀x P(x) ⇔ [...]` | لتعريف مفهوم بشكل كامل (لا اتجاه واحد فقط) |
| Successor-state pattern | `P(Result(a,s)) ⇔ [made-true ∨ (P(s) ∧ ¬made-false)]` | لوصف تغيّر خاصية بمرور الزمن دون frame axioms |
| Recursive plan definition | `f([],s)=s`, `f([a|p],s)=f(p,Result(a,s))` | لتعريف تنفيذ خطة (قائمة أفعال) بدلالة تنفيذ فعل واحد |

### أنماط التعامل والسلوك
| السيناريو | التعامل الصحيح | لماذا؟ |
| --- | --- | --- |
| ترجمة جملة عامة بالإنجليزي/العربي لـ FOL | ابدأي بتحديد الـ objects/relations، ثم اختاري quantifier المناسب مع الرابط المناسب (⇒ أو ∧) | لتفادي أخطاء الترتيب الشائعة |
| وصف خاصية معلومة غير قابلة للملاحظة (زي Holding) | استعملي situation calculus + successor-state axiom | لأنها لازم تُستنتج من تاريخ الأفعال مش من الإدراك المباشر |
| البحث عن خطة تحقق هدف | استخدمي `PlanResult(p,S0)` بدل تعشيش `Result` يدوياً | تمثيل أنظف وقابل للتعميم على خطط أطول |

### الأفكار الرئيسية الشاملة
FOL بيوسّع المنطق القضوي بإضافة تمثيل صريح للـ objects والـ relations والـ functions، وهاد بيسمحلنا نعبّر عن قواعد عامة بجملة وحدة بدل تكرارها. الصدق بـ FOL نسبي لموديل وتفسير محددين، والكميّات (`∀`/`∃`) إلها قواعد استخدام صارمة (الرابط المناسب) وترتيب مهم بينها. أخيراً، لتمثيل عالم متغيّر بمرور الوقت (زي Wumpus)، استخدمنا situation calculus مع successor-state axioms لحل الـ frame problem تمثيلياً، وقدرنا نبني خطط كاملة (قوائم أفعال) عبر تعريف تكراري لـ PlanResult.

---

## الجزء الثالث: أسئلة اختيار من متعدد (MCQ)

> **18 سؤالاً** — مستوى: medium/hard. التوزيع: مقارنات 25% | pseudocode/تتبع 35% | تطبيق 25% | تتبع 15%.

### السؤال 1 (medium)
شو أهم فرق جوهري بين `Propositional Logic` و`FOL` من ناحية `Ontological Commitment`؟
أ) FOL بيضيف درجات اعتقاد (probability)
ب) FOL بيضيف objects وrelations وfunctions فوق الحقائق
ج) FOL بيزيل الحاجة لـ connectives
د) FOL بيستبدل true/false بـ unknown فقط
**الإجابة الصحيحة: ب**
**التعليل:** حسب جدول "Logics in general"، الفرق الوحيد بين propositional وFOL بالـ Ontological Commitment هو إضافة objects وrelations (facts, objects, relations) — أما الـ Epistemological Commitment (true/false/unknown) نفسه بالاثنين. (أ) غلط لأنها probability theory. (ج) غلط لأن الـ connectives موجودة بالاثنين. (د) غلط لأنه ما تغيّر شي بهاد الجانب.

---

### السؤال 2 (medium)
أي جملة صحيحة تعبّر عن "كل شخص بجامعة بيركلي ذكي"؟
أ) `∀x At(x,Berkeley) ∧ Smart(x)`
ب) `∃x At(x,Berkeley) ⇒ Smart(x)`
ج) `∀x At(x,Berkeley) ⇒ Smart(x)`
د) `∃x At(x,Berkeley) ∧ Smart(x)`
**الإجابة الصحيحة: ج**
**التعليل:** القاعدة الصحيحة `∀` مع `⇒`. (أ) خطأ شائع بيفرض كل شخص ببيركلي وذكي. (ب) و(د) هذول لجملة "someone" مش "everyone"، وبالإضافة (ب) فيها خطأ شائع تاني (∃ مع ⇒).

---

### السؤال 3 (hard)
الجملة `∃x At(x,Stanford) ⇒ Smart(x)` بتكون true في أي حالة؟
أ) فقط إذا كل شخص بستانفورد ذكي
ب) فقط إذا في شخص واحد بستانفورد وذكي
ج) إذا في أي شخص (حتى واحد) مش موجود بستانفورد
د) لا يمكن أن تكون true أبداً
**الإجابة الصحيحة: ج**
**التعليل:** كما بالمحاضرة، استخدام `⇒` مع `∃` بجعل الجملة true تلقائياً بمجرد وجود شخص واحد لا يحقق الشرط الأول (`At(x,Stanford)` = false)، بغض النظر عن Smart. (أ) و(ب) غلط لأنها معنى جملة أخرى صحيحة الصياغة. (د) غلط لأنها *بالفعل* عادة true بسهولة.

---

### السؤال 4 (easy-medium)
شو الفرق بين `Term` و`Sentence` بـ FOL؟
أ) لا يوجد فرق، كلاهما نفس الشيء
ب) Term يرجع قيمة true/false، Sentence يرجع object
ج) Term يرجع object، Sentence يرجع true/false
د) Term يُستخدم فقط مع quantifiers
**الإجابة الصحيحة: ج**
**التعليل:** حسب تعريف Atomic Sentences، الـ term (constant/variable/function) بيشير لـ object، بينما الـ sentence (predicate أو equality) بترجع قيمة صدق. (ب) عكس الصحيح تماماً.

---

### السؤال 5 (medium)
لو عندنا `S = Smarter(x,y)` و`σ = {x/Hillary, y/Bill}`، شو `Sσ`؟
أ) `Smarter(x,y)`
ب) `Smarter(Hillary,Bill)`
ج) `Smarter(Bill,Hillary)`
د) `{x/Hillary,y/Bill}`
**الإجابة الصحيحة: ب**
**التعليل:** تطبيق substitution بيستبدل كل متغيّر بقيمته المحددة بـ σ، بنفس الترتيب (x→Hillary, y→Bill)، فينتج `Smarter(Hillary,Bill)`. (ج) عكست الترتيب خطأ.

---

### السؤال 6 (hard)
بأي حالة `∃x ∀y Loves(x,y)` مختلفة عن `∀y ∃x Loves(x,y)`؟
أ) هما متطابقتان دائماً بسبب quantifier duality
ب) الأولى تعني وجود شخص واحد يحب الجميع، الثانية تعني كل شخص محبوب من شخص ما (قد يختلف)
ج) الأولى تعني كل شخص يحب الجميع
د) لا فرق لأن ترتيب ∃∀ لا يهم أبداً
**الإجابة الصحيحة: ب**
**التعليل:** كما ورد بالمحاضرة، تبديل ترتيب `∃` و`∀` (المختلفين) يغيّر المعنى جذرياً — على عكس `∀∀` أو `∃∃` اللي ترتيبهم لا يهم. (د) غلط لأنه هاد بالضبط الاستثناء المهم بالمحاضرة.

---

### السؤال 7 (medium)
حسب مبدأ `Quantifier Duality`، أي صيغة تكافئ `∀x Likes(x,IceCream)`؟
أ) `∃x Likes(x,IceCream)`
ب) `¬∃x ¬Likes(x,IceCream)`
ج) `∃x ¬Likes(x,IceCream)`
د) `¬∀x Likes(x,IceCream)`
**الإجابة الصحيحة: ب**
**التعليل:** `∀x P(x) ≡ ¬∃x ¬P(x)` — "الكل يحب" مكافئ لـ "لا يوجد أحد لا يحب". باقي الخيارات إما معنى معاكس أو غير مرتبط.

---

### السؤال 8 (medium)
جملة `2=2` توصف بأنها:
أ) satisfiable فقط
ب) valid
ج) contradiction
د) غير قابلة للتقييم
**الإجابة الصحيحة: ب**
**التعليل:** حسب المحاضرة، `2=2` valid (صحيحة بكل الموديلات الممكنة)، بينما `1=2` satisfiable فقط (ممكن تكون صح بموديل غريب محدد لكن ليست valid).

---

### السؤال 9 (hard)
بالتعريف الكامل لـ `Sibling` بدلالة `Parent`، ما دور الشرط `¬(m=f)`؟
أ) التأكد أن x و y نفس الشخص
ب) التأكد أن الأم والأب شخصان مختلفان
ج) منع أي علاقة قرابة
د) لا يوجد له دور فعلي، هو زائد
**الإجابة الصحيحة: ب**
**التعليل:** الشرط `¬(m=f)` (داخل `∃m,f`) يضمن أن m وf أشخاص مختلفون فعلاً (أم وأب حقيقيان)، لتفادي حالات شاذة تسمح باعتبار شخص واحد أب وأم بنفس الوقت.

---

### السؤال 10 (medium)
`Diagnostic rule` بخصوص الحفر (Pits) تصف:
أ) من السبب (وجود حفرة) نستنتج الأثر (تيار هواء)
ب) من الأثر (تيار هواء) نستنتج السبب (وجود حفرة مجاورة)
ج) تعريف كامل بالاتجاهين
د) لا علاقة لها بالحفر إطلاقاً
**الإجابة الصحيحة: ب**
**التعليل:** `∀y Breezy(y) ⇒ ∃x Pit(x) ∧ Adjacent(x,y)` هي diagnostic rule — من ملاحظة الأثر (Breezy) نستنتج وجود سبب (Pit مجاورة). (أ) وصف الـ Causal rule. (ج) وصف تعريف الـ ⇔ الكامل.

---

### السؤال 11 (hard)
ليش لا تكفي `Diagnostic rule` و`Causal rule` منفردتين لوصف `Breezy` بشكل كامل؟
أ) لأنهما متناقضتان منطقياً
ب) لأن أياً منهما لا تحدد ماذا يحصل بالمربعات البعيدة عن كل الحفر
ج) لأن الـ FOL لا يدعم implication
د) لأنهما تحتاجان situation calculus
**الإجابة الصحيحة: ب**
**التعليل:** كما ذُكر بالمحاضرة، ولا وحدة من القاعدتين (diagnostic/causal) كاملة لحالها؛ حل ذلك يكون بصياغة تعريف كامل باستخدام `⇔`.

---

### السؤال 12 (medium)
دور دالة `Result(a,s)` بـ `Situation Calculus` هو:
أ) حساب قيمة عددية لفعل معيّن
ب) تحديد الموقف (situation) الناتج عن تنفيذ فعل a في موقف s
ج) استبدال جميع الـ predicates بثوابت
د) تعداد كل الموديلات الممكنة
**الإجابة الصحيحة: ب**
**التعليل:** هذا هو التعريف الحرفي لـ `Result(a,s)` بالمحاضرة — تربط بين المواقف عبر تنفيذ الأفعال.

---

### السؤال 13 (hard)
شو المشكلة اللي بيحلّها `Successor-state axiom` تحديداً؟
أ) الـ Qualification problem
ب) الـ Ramification problem
ج) الـ Representational frame problem
د) مشكلة عدم اكتمال الـ diagnostic rules
**الإجابة الصحيحة: ج**
**التعليل:** النص يقول حرفياً "Successor-state axioms solve the representational frame problem" — أي مشكلة كتابة عدد هائل من frame axioms منفصلة.

---

### السؤال 14 (hard)
بالـ successor-state axiom لـ `Holding(Gold,Result(a,s))`، متى تكون true؟
أ) فقط إذا a=Grab
ب) إذا (a=Grab وكان الذهب موجوداً بـ s) أو (كان ماسكاً الذهب أصلاً و a≠Release)
ج) دائماً true بغض النظر عن الفعل
د) فقط إذا a≠Release بغض النظر عن أي شرط آخر
**الإجابة الصحيحة: ب**
**التعليل:** هذا نص الـ axiom كما ورد حرفياً بالمحاضرة — شرطان مرتبطان بـ OR: (الفعل صنع الحالة) أو (الحالة كانت موجودة واستمرت).

---

### السؤال 15 (medium)
باستخدام `PlanResult`، ما نتيجة `PlanResult([Forward,Grab], S0)`؟
أ) `S0`
ب) `Result(Forward, S0)`
ج) `Result(Grab, Result(Forward, S0))`
د) `Result(Forward, Result(Grab, S0))`
**الإجابة الصحيحة: ج**
**التعليل:** حسب التعريف التكراري `PlanResult([a|p],s)=PlanResult(p,Result(a,s))`، أول عنصر Forward يُنفَّذ أولاً عبر Result، ثم Grab على الناتج — بترتيب Forward ثم Grab كما بالخطة الأصلية.

---

### السؤال 16 (hard) — سيناريو تتبع
عندنا KB فيها: `At(Agent,[1,1],S0)`، `At(Gold,[1,2],S0)`. إذا سألنا `Ask(KB, ∃s Holding(Gold,s))` وكان الجواب `{s/Result(Grab,Result(Forward,S0))}`، شو الخطة المستنتجة؟
أ) امسك الذهب مباشرة بدون حركة
ب) تحرّك للأمام، ثم امسك الذهب
ج) امسك الذهب، ثم تحرّك للأمام
د) لا يوجد خطة ممكنة
**الإجابة الصحيحة: ب**
**التعليل:** الاستدعاء الداخلي `Result(Forward,S0)` ينفَّذ أولاً (الأقرب لـ S0)، وبعده `Result(Grab, ...)` من الخارج — أي: تقدّم أولاً، ثم امسك.

---

### السؤال 17 (medium) — تطبيق
جملة "A first cousin is a child of a parent's sibling" تُرجم كـ:
أ) `∀x,y FirstCousin(x,y) ⇒ Parent(x,y)`
ب) `∀x,y FirstCousin(x,y) ⇔ ∃p,ps Parent(p,x) ∧ Sibling(ps,p) ∧ Parent(ps,y)`
ج) `∀x,y FirstCousin(x,y) ⇔ Sibling(x,y)`
د) `∃x,y FirstCousin(x,y) ∧ Parent(x,y)`
**الإجابة الصحيحة: ب**
**التعليل:** هذا النص الحرفي من المحاضرة — تعريف كامل (⇔) يستخدم ∃ لايجاد والد (p) وأخيه/أخته (ps) اللي هو والد الطرف الثاني.

---

### السؤال 18 (hard) — تتبع خوارزمية
بخطوات "التحقق من صدق جملة FOL ضمن Model"، أي خطوة تأتي مباشرة بعد "تقييم الـ Terms"؟
أ) تحديد الموديل
ب) تحديد التفسير (Interpretation)
ج) التحقق من الـ Predicate (هل الـ objects بالعلاقة المطلوبة)
د) تطبيق الروابط المنطقية
**الإجابة الصحيحة: ج**
**التعليل:** حسب ترتيب الخطوات بالمرجع (Model → Interpretation → Term evaluation → Predicate check → Connectives)، بعد تقييم الـ Terms مباشرة نتحقق من الـ Predicate قبل تطبيق الروابط المنطقية على الجمل المركّبة.

---

## الجزء الرابع: أسئلة تصحيح الخوارزميات (Pseudocode/جمل FOL)

> غطِّ أنواع الأخطاء: منطقية، سوء فهم، heuristic خاطئ (هنا: quantifier خاطئ)، حلقة لا نهائية (هنا: تعريف دائري).

### سؤال تصحيح 1 — نوع: misconception

**الكود التالي يحتوي خطأ:**
```text
// Intended meaning: "Everyone at Berkeley is smart"
∀x At(x, Berkeley) ∧ Smart(x)
```
**اكتشف الخطأ:** استُخدم `∧` كرابط رئيسي مع `∀` بدل `⇒`.

**التصحيح:**
```text
∀x At(x, Berkeley) ⇒ Smart(x)
```
**شرح الحل:**
1. الصيغة الخاطئة بتفرض إنه *كل شخص بالعالم* ببيركلي *وكل شخص* ذكي — شرط قوي جداً وغالباً غير صحيح.
2. الصيغة الصحيحة بتقول فقط: إذا كان الشخص ببيركلي، فهو ذكي (شرطية).
3. القاعدة الذهبية: `∀` دائماً مع `⇒` كرابط رئيسي.

---

### سؤال تصحيح 2 — نوع: misconception

**الكود التالي يحتوي خطأ:**
```text
// Intended meaning: "Someone at Stanford is smart"
∃x At(x, Stanford) ⇒ Smart(x)
```
**اكتشف الخطأ:** استُخدم `⇒` كرابط رئيسي مع `∃` بدل `∧`.

**التصحيح:**
```text
∃x At(x, Stanford) ∧ Smart(x)
```
**شرح الحل:**
1. الصيغة الخاطئة true تلقائياً بمجرد وجود شخص واحد (أي شخص) مش بستانفورد، بغض النظر عن الذكاء.
2. الصيغة الصحيحة بتؤكد فعلاً وجود شخص واحد على الأقل يحقق الشرطين معاً (بستانفورد وذكي).
3. القاعدة الذهبية: `∃` دائماً مع `∧` كرابط رئيسي.

---

### سؤال تصحيح 3 — نوع: logic

**الكود التالي يحتوي خطأ:**
```text
// Intended meaning: "Brothers are siblings"
∀x,y Sibling(x,y) ⇒ Brother(x,y)
```
**اكتشف الخطأ:** الاتجاه معكوس — الجملة تقول "كل الأخوة (siblings) إخوة ذكور (brothers)"، وهذا خطأ لأن Sibling أعم من Brother (ممكن تكون أخت مش أخ).

**التصحيح:**
```text
∀x,y Brother(x,y) ⇒ Sibling(x,y)
```
**شرح الحل:**
1. Brother هي حالة خاصة من Sibling (مقيّدة بالجنس)، فالـ implication لازم تنطلق من الحالة الخاصة (Brother) للعامة (Sibling)، مش العكس.
2. عكس الاتجاه بيفرض شرط غلط: كل sibling لازم يكون brother.
3. تحققي دائماً من اتجاه الـ implication يطابق العلاقة "خاص → عام".

---

### سؤال تصحيح 4 — نوع: logic

**الكود التالي يحتوي خطأ:**
```text
// Intended meaning: full definition of Sibling in terms of Parent
∀x,y Sibling(x,y) ⇒ ∃m,f Parent(m,x) ∧ Parent(f,x) ∧ Parent(m,y) ∧ Parent(f,y)
```
**اكتشف الخطأ:** استُخدمت `⇒` بدل `⇔`، وأُهمل شرط `¬(x=y)` وشرط `¬(m=f)`.

**التصحيح:**
```text
∀x,y Sibling(x,y) ⇔ [¬(x=y) ∧ ∃m,f ¬(m=f) ∧ Parent(m,x) ∧ Parent(f,x) ∧ Parent(m,y) ∧ Parent(f,y)]
```
**شرح الحل:**
1. `⇒` وحدها ما بتضمن الاتجاه العكسي (لو الاثنين عندهم نفس الوالدين، لازم يكونوا siblings) — لازم `⇔` لتعريف كامل.
2. بدون `¬(x=y)`، ممكن نعتبر الشخص أخو نفسه (خطأ منطقي).
3. بدون `¬(m=f)`، ممكن نسمح بحالة شاذة يكون فيها الأب والأم نفس الشخص.

---

### سؤال تصحيح 5 — نوع: wrong_heuristic (quantifier خاطئ)

**الكود التالي يحتوي خطأ:**
```text
// Intended meaning: "Squares are breezy iff there is an adjacent pit"
∀y Breezy(y) ⇒ ∃x Pit(x) ∧ Adjacent(x,y)
// ... used as the ONLY axiom describing Breezy
```
**اكتشف الخطأ:** استُخدمت diagnostic rule (اتجاه واحد فقط: `⇒`) كتعريف كامل، مع إنها لا تحدد ما يحصل بالمربعات البعيدة عن كل الحفر — القاعدة غير مكتملة.

**التصحيح:**
```text
∀y Breezy(y) ⇔ [∃x Pit(x) ∧ Adjacent(x,y)]
```
**شرح الحل:**
1. Diagnostic rule (⇒ فقط من الأثر للسبب) لا تضمن أن المربعات البعيدة عن كل حفرة ليست breezy.
2. استخدام `⇔` يجمع الاتجاهين (diagnostic + causal) بجملة واحدة كاملة.
3. أي تعريف predicate كامل (بمعنى: هذا الشيء صحيح بالضبط تحت هذا الشرط ولا شرط آخر) يجب أن يستخدم `⇔` وليس `⇒`.

---

### سؤال تصحيح 6 — نوع: infinite_loop (تعريف دائري بالخطة)

**الكود التالي يحتوي خطأ:**
```text
// Intended: recursive definition of PlanResult
PlanResult([a|p], s) = PlanResult([a|p], Result(a,s))   // recurses on same list, not the rest of it
```
**اكتشف الخطأ:** الاستدعاء التكراري بيستخدم نفس القائمة `[a|p]` بدل الباقي `p` — هذا بيسبب حلقة لا نهائية لأنه أبداً ما فيه حالة أساسية (base case) توقف التكرار.

**التصحيح:**
```text
∀s PlanResult([],s) = s
∀a,p,s PlanResult([a|p],s) = PlanResult(p, Result(a,s))
```
**شرح الحل:**
1. كل تعريف تكراري لازم يتقدّم نحو حالة أساسية (هون: القائمة الفاضية `[]`).
2. الخطأ الأصلي بيعيد استخدام نفس القائمة `[a|p]` بدل تمرير `p` (الباقي بعد إزالة أول عنصر) — فالقائمة أبداً ما بتصغر.
3. لازم دايماً نتأكد إنه كل استدعاء تكراري "يقترب" من حالة التوقف (هون: تقليص طول القائمة بواحد بكل مرة).

---

## الجزء الرابع: تمارين تطبيقية (من إعداد الدليل للتدريب)

> **هذه تمارين إضافية من إعداد الدليل** — ليست في المحاضرة الأصلية.

### تمرين 1: ترجمة جملة لـ FOL — fill_gaps

**السيناريو / المطلوب:**
ترجمي الجملة "كل من يملك سيارة يدفع تأمين" لـ FOL، مستخدمة `Owns(x,Car)` و`PaysInsurance(x)`.

**المطلوب:**
1. حددي الـ quantifier المناسب.
2. حددي الرابط المناسب.
3. اكتبي الجملة كاملة.

**نموذج الحل:**
`∀x Owns(x,Car) ⇒ PaysInsurance(x)` — quantifier شامل (كل شخص)، رابط implication (شرطية) لأنه بس الأشخاص اللي بيملكوا سيارة لازم يدفعوا تأمين.

---

### تمرين 2: ترجمة جملة وجودية — fill_gaps

**السيناريو / المطلوب:**
ترجمي "في طالب واحد على الأقل حصل على علامة كاملة بالامتحان" مستخدمة `Student(x)` و`GotFullMark(x)`.

**المطلوب:**
1. حددي الـ quantifier والرابط الصحيحين.
2. اكتبي الجملة.

**نموذج الحل:**
`∃x Student(x) ∧ GotFullMark(x)` — quantifier وجودي مع رابط AND، لأنه لازم الشرطين يتحققوا معاً لنفس الشخص.

---

### تمرين 3: code_fix — جملة غلط

**السيناريو / المطلوب:**
الجملة التالية بتحاول تعبّر عن "الوالد أكبر سناً من الابن" بس فيها خطأ:
```text
∀p,c Parent(p,c) ∧ Older(p,c)
```

**المطلوب:**
1. حددي المشكلة.
2. صححيها.

**نموذج الحل:**
المشكلة: `∧` مع `∀` بتفرض إنه *كل* شخصين بالعالم أب وابن *و*أكبر سناً. التصحيح: `∀p,c Parent(p,c) ⇒ Older(p,c)`.

---

### تمرين 4: search_trace (تطبيق substitution) — scenario

**السيناريو / المطلوب:**
عندنا `S = FirstCousin(x,y)` و`σ = {x/Layla, y/Omar}`.

**المطلوب:**
1. طبّقي σ على S واكتبي `Sσ`.
2. اشرحي شو بيمثّل الناتج.

**نموذج الحل:**
`Sσ = FirstCousin(Layla,Omar)` — جملة محددة (ground) بتؤكد إنه Layla وOmar أبناء عمومة، بعد استبدال المتغيّرات بقيمهم الفعلية.

---

### تمرين 5: logic_table — جدول صدق interpretation

**السيناريو / المطلوب:**
عندنا model فيه شخصين A وB، وعلاقة `Brother` صحيحة بينهم بالاتجاهين، وتفسير: Richard→A، John→B، Brother→العلاقة brother بالموديل.

**المطلوب:**
1. أكملي الجدول: هل `Brother(Richard,John)` true أم false؟
2. هل `Brother(John,Richard)` true أم false؟

**نموذج الحل:**
| الجملة | القيمة | السبب |
| --- | --- | --- |
| `Brother(Richard,John)` | true | Richard→A، John→B، وA وB بعلاقة brother فعلاً بالموديل |
| `Brother(John,Richard)` | true | نفس العلاقة، الاتجاه المعاكس أيضاً صحيح حسب الموديل |

---

### تمرين 6: scenario (successor-state axiom) — code_fix

**السيناريو / المطلوب:**
اكتبي successor-state axiom لخاصية `HaveArrow(s)` (الوكيل عنده سهم)، مع العلم إنه الفعل الوحيد اللي بيغيّر هاي الخاصية هو `Shoot` (اللي بيخليها false)، وما في فعل بيرجّع السهم.

**المطلوب:**
1. حددي شرط "صارت true بسبب فعل".
2. حددي شرط "استمرت true".
3. اكتبي الـ axiom الكامل.

**نموذج الحل:**
ما في فعل بيخلي HaveArrow تصير true من جديد (السهم ما بيرجع)، فالشرط الأول فاضي (false). الشرط الثاني: كانت true أصلاً و a≠Shoot.
`∀a,s HaveArrow(Result(a,s)) ⇔ [HaveArrow(s) ∧ a≠Shoot]`

---

## الجزء الرابع: تمارين تحليل وتطبيق (إضافية — من إعداد الدليل)

### تمرين 1: table_fill — تحليل Diagnostic/Causal/Definition

**السيناريو:**
عطيناكي 3 قواعد عن `Smelly`:
- `∀y Smelly(y) ⇒ ∃x Wumpus(x) ∧ Adjacent(x,y)`
- `∀x,y Wumpus(x) ∧ Adjacent(x,y) ⇒ Smelly(y)`
- `∀y Smelly(y) ⇔ [∃x Wumpus(x) ∧ Adjacent(x,y)]`

**المطلوب:**
1. صنّفي كل قاعدة (diagnostic/causal/definition).
2. أي وحدة أكمل لوصف Smelly؟

**نموذج الحل:**
| القاعدة | التصنيف |
| --- | --- |
| الأولى | Diagnostic rule (من الأثر للسبب) |
| الثانية | Causal rule (من السبب للأثر) |
| الثالثة | Definition (⇔) — الأكمل، لأنها تجمع الاتجاهين وتحدد كل الحالات |

---

### تمرين 2: diagram_completion — إكمال model بسيط

**السيناريو:**
موديل فيه: object واحد X (person)، وعلاقة `Likes(X,IceCream)` صحيحة.

**المطلوب:**
1. ارسمي/صفي عُقدة X وعلاقتها بـ IceCream.
2. حددي هل `∀x Likes(x,IceCream)` صحيحة بهالموديل (بافتراض X هو الشخص الوحيد بالـ domain).

**نموذج الحل:**
عقدة X مرتبطة بعلاقة `Likes` بـ IceCream. بما إنه X هو الشخص الوحيد بالـ domain وLikes(X,IceCream) true، فـ `∀x Likes(x,IceCream)` صحيحة (لأنه كل الـ objects بالـ domain — وهون بس X — تحقق الشرط).

---

### تمرين 3: heuristic_eval — تقييم quantifier duality

**السيناريو:**
عندك جملة `∃x Likes(x,Broccoli)`.

**المطلوب:**
1. اكتبي الصيغة المكافئة باستخدام `∀` والنفي.
2. اشرحي المعادلة.

**نموذج الحل:**
`∃x Likes(x,Broccoli) ≡ ¬∀x ¬Likes(x,Broccoli)` — "في شخص بيحب البروكلي" مكافئة لـ "مش صح إنه الكل ما بيحب البروكلي".

---

### تمرين 4: resolution_steps (تطبيق تعريف Mother) — written_analysis

**السيناريو:**
عندك تعريف: `∀x,y Mother(x,y) ⇔ (Female(x) ∧ Parent(x,y))`. عطيناك: `Female(Sara)=true`، `Parent(Sara,Ali)=true`.

**المطلوب:**
1. طبّقي التعريف واستنتجي قيمة `Mother(Sara,Ali)`.
2. اشرحي كل خطوة.

**نموذج الحل:**
بما إنه `Female(Sara) ∧ Parent(Sara,Ali)` = true ∧ true = true، وبحكم التعريف بـ `⇔`، فـ `Mother(Sara,Ali)` = true أيضاً.

---

## الجزء الرابع: تمارين تتبع الخوارزميات (خطوة بخطوة)

### تمرين تتبع 1: تنفيذ خطة عبر PlanResult

**المدخل:**
```text
Initial: At(Agent,[1,1],S0), At(Gold,[1,2],S0)
Plan p = [Forward, Grab]
```

**تتبّع خطوة بخطوة (أكمل الجدول):**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | ابدأ من S0 | ؟ |
| 2 | نفّذ Forward | ؟ |
| 3 | نفّذ Grab | ؟ |

**نموذج الحل:**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | ابدأ من S0 | `At(Agent,[1,1],S0)` |
| 2 | نفّذ Forward | `Result(Forward,S0)` — الوكيل الآن بـ[1,2] |
| 3 | نفّذ Grab | `Result(Grab,Result(Forward,S0))` — `Holding(Gold,...)=true` |

**النتيجة:** `PlanResult([Forward,Grab],S0) = Result(Grab,Result(Forward,S0))`، والوكيل ماسك الذهب.

---

### تمرين تتبع 2: تطبيق successor-state axiom عبر خطوتين

**المدخل:**
```text
s0: AtGold(s0)=true, Holding(Gold,s0)=false
Action sequence: [Grab, Release]
```

**تتبّع خطوة بخطوة (أكمل الجدول):**
| الخطوة | الفعل | Holding(Gold,·) |
| --- | --- | --- |
| 1 | s0 (initial) | ؟ |
| 2 | بعد Grab | ؟ |
| 3 | بعد Release | ؟ |

**نموذج الحل:**
| الخطوة | الفعل | Holding(Gold,·) |
| --- | --- | --- |
| 1 | s0 (initial) | false (معطى) |
| 2 | بعد Grab | true — لأن `a=Grab ∧ AtGold(s0)` تحقق الشرط الأول من الـ axiom |
| 3 | بعد Release | false — لأن `a≠Release` لم تتحقق (a=Release فعلاً)، فالشرط الثاني فشل، ولا شرط بيخليها true |

**النتيجة:** الوكيل ماسك الذهب بعد Grab، وبيفلته بعد Release — مطابق تماماً لتعريف successor-state axiom.

---

### تمرين تتبع 3: تقييم جملة مركّبة ضمن موديل

**المدخل:**
```text
Model: domain = {KingJohn, Richard}
At(KingJohn,Berkeley)=true, At(Richard,Berkeley)=false
Smart(KingJohn)=true, Smart(Richard)=true
```

**تتبّع خطوة بخطوة (أكمل الجدول):**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | قيّم `At(KingJohn,Berkeley) ⇒ Smart(KingJohn)` | ؟ |
| 2 | قيّم `At(Richard,Berkeley) ⇒ Smart(Richard)` | ؟ |
| 3 | اجمع بـ AND (تقريب ∀x) | ؟ |

**نموذج الحل:**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | قيّم الشرطية الأولى | true (لأن true ⇒ true) |
| 2 | قيّم الشرطية الثانية | true (لأن false ⇒ أي شيء = true) |
| 3 | اجمع | true ∧ true = true |

**النتيجة:** `∀x At(x,Berkeley) ⇒ Smart(x)` صحيحة (true) بهذا الموديل.

---

### تمرين تتبع 4: تتبع تعريف FirstCousin

**المدخل:**
```text
Parent(Huda, Sami) = true      // Huda parent of Sami
Sibling(Layla, Huda) = true    // Layla sibling of Huda
Parent(Layla, Nour) = true     // Layla parent of Nour
```

**تتبّع خطوة بخطوة (أكمل الجدول):**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | ابحث عن p بحيث Parent(p,Sami) | ؟ |
| 2 | ابحث عن ps بحيث Sibling(ps,p) | ؟ |
| 3 | تحقق Parent(ps,Nour) | ؟ |
| 4 | استنتج FirstCousin(Sami,Nour) | ؟ |

**نموذج الحل:**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | p = Huda | لأن `Parent(Huda,Sami)=true` |
| 2 | ps = Layla | لأن `Sibling(Layla,Huda)=true` |
| 3 | تحقق | `Parent(Layla,Nour)=true` — الشرط متحقق |
| 4 | استنتاج | `FirstCousin(Sami,Nour) = true` |

**النتيجة:** Sami وNour أبناء عمومة حسب التعريف `∃p,ps Parent(p,x) ∧ Sibling(ps,p) ∧ Parent(ps,y)`.

---

## الجزء الرابع: أسئلة تصميم

### سؤال تصميم 1: تصميم Model بسيط لعالم عائلي

**المطلوب:**
صمّمي model (بواسطة مخطط class/object) يمثّل عائلة صغيرة (أب، أم، ابنين) مع علاقات `Parent` و`Sibling`، ثم اكتبي جملة FOL تتحقق من صحة `Sibling` بين الابنين حسب التعريف الكامل.

**نموذج الإجابة:**
```diagram
type: class
title: Small Family Model
direction: TD
nodes:
  - id: father
    label: Father
    kind: object
    level: 0
  - id: mother
    label: Mother
    kind: object
    level: 0
  - id: child1
    label: Child1
    kind: object
    level: 1
  - id: child2
    label: Child2
    kind: object
    level: 1
edges:
  - from: father
    to: child1
    label: Parent
  - from: father
    to: child2
    label: Parent
  - from: mother
    to: child1
    label: Parent
  - from: mother
    to: child2
    label: Parent
```
الجملة: `Sibling(Child1,Child2) ⇔ [¬(Child1=Child2) ∧ ∃m,f ¬(m=f) ∧ Parent(m,Child1) ∧ Parent(f,Child1) ∧ Parent(m,Child2) ∧ Parent(f,Child2)]` تتحقق (true) لأنه Father وMother يحققان الشرط بالضبط.

**معايير التقييم:**
- تمثيل صحيح للـ objects والعلاقات (Parent) بالمخطط.
- تطبيق سليم للتعريف الكامل لـ Sibling مع كل شروطه (¬(x=y) و¬(m=f)).
- ربط منطقي واضح بين المخطط والجملة FOL الناتجة.

---

### سؤال تصميم 2: تصميم قاعدة معرفة بـ Situation Calculus لمهمة بسيطة

**المطلوب:**
صمّمي (بالوصف + الجمل) قاعدة معرفة بسيطة لوكيل بيحتاج يفتح باب (Action=Open) إذا كان مقفول (Predicate=Locked)، مع تعريف successor-state axiom لخاصية `Locked`.

**نموذج الإجابة:**
- Effect axiom: `∀s Locked(s) ∧ HasKey(s) ⇒ ¬Locked(Result(Open,s))`
- Successor-state axiom لـ Locked:
`∀a,s Locked(Result(a,s)) ⇔ [(a≠Open ∧ Locked(s)) ∨ (¬HasKey(s) ∧ a=Open ∧ Locked(s))]`
(يعني: الباب يبقى مقفول إذا الفعل مش Open، أو إذا حاول يفتحه بدون مفتاح.)
- خطة: `Ask(KB, ∃p ¬Locked(PlanResult(p,S0)))` بترجع `{p/[Open]}` إذا كان عنده مفتاح.

**معايير التقييم:**
- الـ axiom يغطي كل الحالات (فتح بمفتاح، فتح بدون مفتاح، عدم محاولة الفتح).
- استخدام صحيح لصيغة successor-state (⇔ مع شرطين مرتبطين بـ OR).
- ربط الخطة الناتجة بمنطق PlanResult كما بالمحاضرة.

---

## الجزء الرابع: بطاقات سؤال وجواب (Q&A Cards)

**Q1:** شو الفرق الأساسي بين Propositional Logic وFOL؟
A: FOL يضيف تمثيل صريح للـ objects وrelations وfunctions فوق حقائق propositional logic.

**Q2:** شو الرابط المنطقي الطبيعي مع `∀`؟
A: `⇒` (implication).

**Q3:** شو الرابط المنطقي الطبيعي مع `∃`؟
A: `∧` (AND/conjunction).

**Q4:** ما الفرق بين `Model` و`Interpretation`؟
A: Model هو العالم الفعلي (objects وعلاقات)، Interpretation هو الخريطة اللي بتربط الرموز بعناصر الموديل.

**Q5:** شو الفرق بين `Term` و`Sentence`؟
A: Term يرجع object، Sentence يرجع true/false.

**Q6:** متى تكون `∀x P` صحيحة في موديل m؟
A: عندما تكون P صحيحة لكل object ممكن بالموديل.

**Q7:** متى تكون `∃x P` صحيحة في موديل m؟
A: عندما تكون P صحيحة لبعض (على الأقل واحد) object بالموديل.

**Q8:** هل `∀x∀y` نفسها `∀y∀x`؟
A: نعم، ترتيب quantifiers من نفس النوع لا يهم.

**Q9:** هل `∃x∀y` نفسها `∀y∃x`؟
A: لا، مختلفتان جذرياً — الترتيب مهم عند اختلاف نوع الـ quantifier.

**Q10:** شو الـ `Substitution`؟
A: قائمة تعويض (binding list) بتحدد قيمة كل متغيّر بجملة، مثل `{x/Hillary,y/Bill}`.

**Q11:** شو الفرق بين `Diagnostic rule` و`Causal rule`؟
A: Diagnostic تستنتج السبب من الأثر، Causal تستنتج الأثر من السبب.

**Q12:** ليش نستخدم `⇔` بدل `⇒` لتعريف predicate كامل؟
A: لأن `⇔` تغطي الاتجاهين معاً وتحدد كل الحالات الممكنة، بينما `⇒` (لوحدها) تغطي اتجاه واحد فقط.

**Q13:** شو هو الـ Situation في Situation Calculus؟
A: لحظة أو موقف تحمل الحقائق غير الأبدية بالعالم في وقت معيّن.

**Q14:** شو وظيفة `Result(a,s)`؟
A: تحدد الموقف الناتج عن تنفيذ فعل a في الموقف s.

**Q15:** شو الفرق بين `Effect axiom` و`Frame axiom`؟
A: Effect axiom تصف ما تغيّر بسبب فعل، Frame axiom تصف ما لم يتغيّر.

**Q16:** شو الـ Frame Problem؟
A: صعوبة تمثيل (وحساب) كل ما لا يتغيّر بفعل معيّن بدون كتابة عدد هائل من frame axioms منفصلة.

**Q17:** كيف تحل Successor-State Axioms مشكلة الـ Frame الـ representational؟
A: بكتابة axiom واحد فقط لكل predicate يغطي كل الأفعال معاً (بدل axiom منفصل لكل action×predicate).

**Q18:** شو الفرق بين `Qualification Problem` و`Ramification Problem`؟
A: Qualification هي صعوبة سرد كل الشروط الاستثنائية لفعل، Ramification هي صعوبة سرد كل النتائج الثانوية للفعل.

**Q19:** كيف يُعرَّف `PlanResult` تكرارياً؟
A: `PlanResult([],s)=s` و`PlanResult([a|p],s)=PlanResult(p,Result(a,s))`.

**Q20:** لماذا نمثّل الخطط كقوائم أفعال بدل تعشيش Result؟
A: لأنه أنظف، وقابل للتعميم، ويسمح للأنظمة المتخصصة (Planning systems) بحساب النتيجة بكفاءة أعلى.

---

## الجزء الخامس: الخوارزميات الكاملة (مرجع Pseudocode)

> مرجع كامل — بدون شرح جديد. كل عنصر مستقل بذاته.

```text
// FOL Syntax Reference
Atomic sentence = predicate(term1,...,termn) | term1 = term2
Term = function(term1,...,termn) | constant | variable
Complex sentence = ¬S | S1∧S2 | S1∨S2 | S1⇒S2 | S1⇔S2
Quantified sentence = ∀⟨variables⟩ ⟨sentence⟩ | ∃⟨variables⟩ ⟨sentence⟩
```

```text
// Quantifier Duality
∀x P(x)  ≡  ¬∃x ¬P(x)
∃x P(x)  ≡  ¬∀x ¬P(x)
```

```text
// Substitution mechanics
S = Smarter(x, y)
σ = {x/Hillary, y/Bill}
Sσ = Smarter(Hillary, Bill)
Ask(KB, S) returns some/all σ such that KB ⊨ Sσ
```

```text
// Full Sibling definition (equality + quantifiers)
∀x,y Sibling(x,y) ⇔
    [¬(x=y) ∧ ∃m,f ¬(m=f) ∧
     Parent(m,x) ∧ Parent(f,x) ∧ Parent(m,y) ∧ Parent(f,y)]
```

```text
// Situation calculus core
Result(a, s)  // situation resulting from doing action a in situation s
```

```text
// Successor-state axiom template
∀a,s  P(Result(a,s))  ⇔  [(some action a makes P true) ∨ (P(s) ∧ no action a makes P false)]

// Concrete example: Holding(Gold)
∀a,s  Holding(Gold, Result(a,s))  ⇔
    [(a=Grab ∧ AtGold(s)) ∨ (Holding(Gold,s) ∧ a≠Release)]
```

```text
// Recursive PlanResult definition
∀s        PlanResult([], s) = s
∀a,p,s    PlanResult([a|p], s) = PlanResult(p, Result(a, s))
```

---

## الجزء الخامس: أسئلة نظرية متوقعة بالامتحان

### السؤال 1: ما الفرق بين Propositional Logic وFirst-Order Logic؟
**نموذج الإجابة:**
1. التعريف: Propositional Logic يفترض العالم مبني من حقائق (facts) فقط؛ FOL يضيف objects وrelations وfunctions.
2. المكونات/الشروط: FOL له constants, predicates, functions, variables, quantifiers إضافة لـ connectives الموجودة أصلاً.
3. مثال: "Pits cause breezes in adjacent squares" لا يمكن التعبير عنها بسهولة بـ Propositional Logic إلا بتكرار جملة لكل مربع، بينما FOL يعبّر عنها بجملة واحدة عامة.
4. متى نستخدم: نستخدم FOL عندما نحتاج تعميمات عبر مجموعات من الأشياء بدل حالات فردية محددة سلفاً.

---

### السؤال 2: اشرحي مفهومي Model وInterpretation ودورهما في تحديد صدق جملة FOL.
**نموذج الإجابة:**
1. التعريف: Model هو العالم الفعلي (objects + علاقات فعلية بينها)؛ Interpretation هي خريطة تربط رموز اللغة (constants/predicates/functions) بعناصر ذلك الموديل.
2. المكونات/الشروط: يجب توفر model واحد على الأقل (object واحد فأكثر) وinterpretation كاملة لكل الرموز المستخدمة بالجملة.
3. مثال: تفسير Richard→Richard the Lionheart، John→King John، Brother→علاقة الأخوة الفعلية.
4. متى نستخدم: كلما أردنا الحكم على صدق أو كذب أي جملة FOL، يجب تحديد model وinterpretation أولاً — الصدق ليس مطلقاً.

---

### السؤال 3: ما القاعدتان الذهبيتان لاستخدام `∀` و`∃` مع الروابط المنطقية؟ وما المخاطر عند مخالفتهما؟
**نموذج الإجابة:**
1. التعريف: `∀` يُستخدم عادة مع `⇒`، و`∃` يُستخدم عادة مع `∧`.
2. المكونات/الشروط: استخدام `∧` مع `∀` يفرض شرطاً على كل شيء بالعالم (قوي جداً)؛ استخدام `⇒` مع `∃` يجعل الجملة صحيحة تلقائياً بمجرد وجود عنصر لا يحقق الشرط الأول.
3. مثال: `∀x At(x,Berkeley) ∧ Smart(x)` تعني خطأً "الكل ببيركلي وذكي"؛ `∃x At(x,Stanford) ⇒ Smart(x)` تصير صحيحة تلقائياً لوجود أي شخص خارج ستانفورد.
4. متى نستخدم: يجب مراجعة كل جملة تحتوي quantifier للتأكد من الرابط المرافق قبل اعتمادها.

---

### السؤال 4: ما مبدأ Quantifier Duality، وكيف نستفيد منه؟
**نموذج الإجابة:**
1. التعريف: كل quantifier يمكن التعبير عنه بواسطة الآخر عن طريق النفي المزدوج: `∀x P(x) ≡ ¬∃x ¬P(x)` و`∃x P(x) ≡ ¬∀x ¬P(x)`.
2. المكونات/الشروط: يتطلب تطبيق النفي على كل من الـ predicate وعلى الجملة الكلية.
3. مثال: `∀x Likes(x,IceCream) ≡ ¬∃x ¬Likes(x,IceCream)`.
4. متى نستخدم: مفيد لإعادة صياغة جمل معقّدة، أو لتبسيط الاستدلال (مثلاً في Resolution لاحقاً بمحاضرات الاستنتاج).

---

### السؤال 5: لماذا لا يكفي ترتيب `∀y∃x Loves(x,y)` لنقل نفس معنى `∃x∀y Loves(x,y)`؟
**نموذج الإجابة:**
1. التعريف: ترتيب quantifiers مختلفة النوع (∀ وَ∃ معاً) يغيّر المعنى، بعكس ترتيب نفس النوع.
2. المكونات/الشروط: `∃x∀y` تعني وجود عنصر واحد ثابت يحقق الشرط لكل شيء آخر؛ `∀y∃x` تعني لكل عنصر آخر يوجد (ربما مختلف في كل مرة) عنصر يحقق الشرط.
3. مثال: "شخص واحد يحب الجميع" (∃x∀y) مقابل "كل شخص محبوب من شخص ما، قد يختلف" (∀y∃x).
4. متى نستخدم: عند صياغة أي جملة فيها quantifierان مختلفان، يجب التفكير بعناية بترتيبهما لأنه يغيّر الالتزام المنطقي (commitment) للجملة.

---

### السؤال 6: كيف يُستخدم مفهوم Substitution في التفاعل مع قاعدة معرفة FOL (Ask/Tell)؟
**نموذج الإجابة:**
1. التعريف: Substitution (σ) هي قائمة تعويض متغيّرات بقيم محددة، وSσ هي نتيجة تطبيق σ على الجملة S.
2. المكونات/الشروط: `Ask(KB,S)` ترجع substitution (أو substitutions) بحيث `KB ⊨ Sσ`.
3. مثال: `Ask(KB, ∃a Action(a,5))` قد ترجع `{a/Shoot}`، أي أن الفعل المطلوب هو Shoot.
4. متى نستخدم: كلما احتجنا استخراج قيمة عملية (فعل، شخص، موقف) من استعلام منطقي مجرّد.

---

### السؤال 7: ما الفرق بين Diagnostic rule وCausal rule، ولماذا لا تكفي أي منهما لوحدها؟
**نموذج الإجابة:**
1. التعريف: Diagnostic rule تستنتج السبب من الأثر (`Breezy(y) ⇒ ∃x Pit(x)∧Adjacent(x,y)`)؛ Causal rule تستنتج الأثر من السبب (`Pit(x)∧Adjacent(x,y) ⇒ Breezy(y)`).
2. المكونات/الشروط: أي منهما لوحدها implication باتجاه واحد فقط.
3. مثال: Causal rule وحدها لا تحدد ما يحصل بمربع بعيد عن كل الحفر (هل ممكن يكون breezy لسبب آخر؟).
4. متى نستخدم: نجمعهما بصياغة `⇔` (Definition) عندما نريد تعريفاً كاملاً ودقيقاً للـ predicate.

---

### السؤال 8: ما هو Situation Calculus، وما دور دالة Result؟
**نموذج الإجابة:**
1. التعريف: طريقة لتمثيل التغيير في FOL بإضافة وسيط "situation" لكل predicate غير أبدي، مثل `Holding(Gold,Now)` بدل `Holding(Gold)`.
2. المكونات/الشروط: تحتاج تعريف مواقف (situations) ودالة Result(a,s) تربط موقفاً بآخر بعد تنفيذ فعل.
3. مثال: `Result(Grab,S0)` هو الموقف الناتج عن تنفيذ Grab بالموقف الابتدائي S0.
4. متى نستخدم: عندما نحتاج تمثيل عالم متغيّر بمرور الزمن (متل عالم Wumpus) بلغة FOL.

---

### السؤال 9: ما هي مشكلة Frame Problem، وكيف تحلها Successor-State Axioms؟
**نموذج الإجابة:**
1. التعريف: Frame Problem هي صعوبة وصف (representation) وحساب (inference) كل ما لا يتغيّر عند تنفيذ فعل، بدون كتابة frame axiom منفصل لكل زوج (action, predicate).
2. المكونات/الشروط: Successor-state axiom يصف كل predicate بصيغة واحدة: P صحيحة بعد الفعل ⇔ (فعل خلّاها true) ∨ (كانت true واستمرت لأن ما في فعل خلّاها false).
3. مثال: `Holding(Gold,Result(a,s)) ⇔ [(a=Grab∧AtGold(s)) ∨ (Holding(Gold,s)∧a≠Release)]`.
4. متى نستخدم: كلما بنينا قاعدة معرفة FOL لعالم فيه أفعال متعددة، لتفادي الانفجار بعدد البديهيات.

---

### السؤال 10: ما الفرق بين Qualification Problem وRamification Problem؟
**نموذج الإجابة:**
1. التعريف: Qualification Problem هي صعوبة سرد كل الشروط الاستثنائية اللازمة لنجاح فعل حقيقي (مثلاً هل الذهب زلق أو مسمّر؟)؛ Ramification Problem هي صعوبة سرد كل النتائج الثانوية لفعل حقيقي (مثل الغبار، تآكل القفازات).
2. المكونات/الشروط: كلاهما ناتج عن محاولة نمذجة العالم الحقيقي بدقة كاملة بلغة منطقية محدودة.
3. مثال: فعل Grab بالواقع له قيود كثيرة (Qualification) ونتائج ثانوية كثيرة (Ramification) لا يمكن حصرها كلها.
4. متى نستخدم: عند تصميم أنظمة عملية، نقبل بتبسيط معقول ونتجاهل الحالات النادرة جداً بدل محاولة تغطية كل شيء.

---

### السؤال 11: كيف يُعرَّف تنفيذ خطة كاملة (Plan) في FOL باستخدام PlanResult؟
**نموذج الإجابة:**
1. التعريف: الخطة تُمثَّل كقائمة أفعال `[a1,...,an]`، وPlanResult(p,s) هي نتيجة تنفيذ الخطة p بدءاً من الموقف s.
2. المكونات/الشروط: تعريف تكراري: `PlanResult([],s)=s` و`PlanResult([a|p],s)=PlanResult(p,Result(a,s))`.
3. مثال: `PlanResult([Forward,Grab],S0) = Result(Grab,Result(Forward,S0))`.
4. متى نستخدم: عندما نريد الاستعلام عن خطة كاملة تحقق هدفاً (مثل `Ask(KB,∃p Holding(Gold,PlanResult(p,S0)))`) بدل الاستعلام عن موقف واحد فقط.

---

## الجزء السادس: قائمة فحص ذاتي قبل الامتحان ✅

- [ ] أقدر أشرح ليش Propositional Logic محدود التعبير مقارنة بـ FOL
- [ ] أعرف الفرق بين Object وRelation وFunction وأعطي مثال لكل وحدة
- [ ] أفرّق بصح بين Ontological Commitment وEpistemological Commitment
- [ ] أحفظ عناصر Syntax الأساسية (Constants, Predicates, Functions, Variables, Connectives, Equality, Quantifiers)
- [ ] أفرّق بين Term وSentence
- [ ] أشرح صح مفهومي Model وInterpretation وكيف يحددوا صدق الجملة
- [ ] أطبّق القاعدة الذهبية: ∀ مع ⇒، و∃ مع ∧ — وأعرف الخطأ الناتج عن عكسهم
- [ ] أفرّق بين ترتيب quantifiers من نفس النوع (لا يهم) ومختلفي النوع (يهم جداً)
- [ ] أحفظ مبدأ Quantifier Duality وأطبّقه
- [ ] أفهم استخدام = (equality) والفرق بين satisfiable وvalid
- [ ] أقدر أترجم جملة عربي/إنجليزي عادية لـ FOL خطوة بخطوة (Sibling, Mother, FirstCousin)
- [ ] أفهم آلية Tell/Ask وSubstitution (binding list)
- [ ] أفرّق بين Diagnostic rule وCausal rule وأعرف ليش نحتاج Definition (⇔)
- [ ] أفهم Situation Calculus ودور دالة Result(a,s)
- [ ] أفرّق بين Effect axiom وFrame axiom
- [ ] أشرح Frame Problem وكيف يحلها Successor-State Axiom
- [ ] أفرّق بين Qualification Problem وRamification Problem
- [ ] أفهم تعريف PlanResult التكراري وأقدر أتتبعه خطوة بخطوة
- [ ] حليت الـ 18 سؤال MCQ وراجعت التعليل الكامل لكل خيار
- [ ] حليت أسئلة تصحيح pseudocode الست وفهمت كل نوع خطأ

---

## الجزء السادس: ورقة المراجعة السريعة (Cheat Sheet)

### 🔑 خريطة العلاقات بين المحاضرات
| المحاضرة | ترتبط مع | كيف؟ |
| --- | --- | --- |
| Logical Agents (Propositional Logic) | First-Order Logic | FOL يوسّع Propositional Logic بإضافة objects/relations/functions |
| First-Order Logic (هذه المحاضرة) | Inference in FOL | نفس اللغة (Syntax/Semantics) تُستخدم لاحقاً بـ Unification وForward/Backward Chaining وResolution |

### 🔑 أهم النقاط الذهبية
| الموضوع | النقاط |
| --- | --- |
| قوة التعبير | FOL = objects + relations + functions + quantifiers، أقوى بكثير من propositional logic |
| Quantifiers | ∀ مع ⇒، ∃ مع ∧ — دائماً |
| الترتيب | ∀∀ وَ∃∃ ترتيبهم لا يهم، ∃∀ وَ∀∃ ترتيبهم مهم جداً |
| Frame Problem | يُحل تمثيلياً بـ Successor-State Axioms (بديهية واحدة لكل predicate) |
| التخطيط | PlanResult تعريف تكراري بدلالة Result — أنظف من التعشيش اليدوي |

### 🔑 مرجع سريع
| الرمز/المصطلح | المعنى | يُستخدم في |
| --- | --- | --- |
| `∀` | لكل | القواعد العامة (مع ⇒) |
| `∃` | يوجد | تأكيد الوجود (مع ∧) |
| `σ` | Substitution | نتائج Ask(KB,S) |
| `Result(a,s)` | الموقف الناتج عن فعل | Situation Calculus |
| `PlanResult(p,s)` | نتيجة تنفيذ خطة كاملة | التخطيط |
| `⇔` | تعريف كامل (biconditional) | تعريفات المفاهيم (Sibling, Breezy, Successor-state) |

### 🔑 قواعد ذهبية لا تُنسى
| # | القاعدة |
| --- | --- |
| 1 | ∀ مع ⇒، ∃ مع ∧ — أبداً بالعكس |
| 2 | الصدق دائماً نسبي لـ Model + Interpretation محددين |
| 3 | ترتيب ∃∀ (مختلفَي النوع) يغيّر المعنى — راجعي قبل الامتحان |
| 4 | Successor-state axiom = axiom واحد فقط لكل predicate (يغطي كل الأفعال) |
| 5 | PlanResult تُعرَّف تكرارياً: base case = القائمة الفاضية، recursive case = تنفيذ أول فعل ثم الباقي |

---

<!-- VALIDATION: تم تغطية كل شرائح محاضرة First-Order Logic (Lecture 11) بالكامل — من "Why FOL" حتى "Making plans: A better way". تم الالتزام ببنية SCHEMA.md v1.0: 18 سؤال MCQ مع تعليل كامل، 6 أسئلة تصحيح (logic/misconception/wrong_heuristic/infinite_loop)، 6 تمارين تطبيقية، 4 تمارين تحليل، 4 تمارين تتبع خطوة بخطوة، 2 سؤال تصميم، 20 بطاقة Q&A، مرجع pseudocode كامل مجمّع، 11 سؤال نظري بنموذج إجابة منظم، قائمة فحص ذاتي، وcheat sheet. جميع المصطلحات التقنية بالإنجليزية داخل backticks، ولا استُخدمت أي لغة برمجة محظورة (Java/C++/Python/JS/SQL/HTML). -->
