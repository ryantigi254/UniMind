// Define the structure of a resource entry
export type ResourceEntry = {
  id: string;
  title: string;
  category: string; // e.g., 'Counselling FAQs', 'Self-Help', 'Crisis Support', 'Counsellors Corner', 'Uni Events & Resources', 'Mental Health Blog', 'Chatbot FAQs'
  imageUrl?: string; // Optional image URL (add later if desired)
  snippet: string; // Short preview text
  content: string; // Full content (markdown format)
  keywords?: string[]; // Optional keywords for search/filtering
};

// Compiled resource data from Knowledgebase files
export const mockResourceEntries: ResourceEntry[] = [
  // --- Counselling FAQs ---
  {
    id: 'faq-counselling-what-is',
    title: 'What is Counselling?',
    category: 'Counselling FAQs',
    snippet: 'Learn about counselling as a talking therapy providing a safe space.',
    content: `## What is Counselling?

Counselling is a talking therapy that provides a safe and confidential space for you to talk to a trained professional (Counsellor or Therapist) about any issues and concerns.

Sometimes it can be helpful to have someone independent to listen and support, to help you make sense of your situation and find your own answers. Counselling can give you an opportunity to explore, discover and clarify ways of living more resourcefully with a greater sense of fulfilment.

Counselling is a common service that many people will use throughout their lives, not just those with a formally diagnosed mental illness.

**Further Reading:** [BACP – What is Counselling](https://www.bacp.co.uk/about-therapy/what-is-counselling/) (External Link)`,
    keywords: ['counselling', 'therapy', 'talking therapy', 'support', 'professional help']
  },
  {
    id: 'faq-counselling-eligibility',
    title: 'Am I Eligible for Uni Counselling?',
    category: 'Counselling FAQs',
    snippet: 'Find out who can access the free UON Counselling Service.',
    content: `## Am I eligible for Counselling?

We accept students from any level of studies, from foundation through to PhD. You must be enrolled, have a student ID number and UON student email address.

You can access counselling if you are taking a study break or suspended from your studies, as long as you continue to remain an enrolled student.

**When am I not eligible?**
*   If you are not enrolled at the University.
*   If you are already receiving counselling or therapy elsewhere (you can still use drop-ins).
*   If you are residing outside the UK (due to legal/ethical reasons).

**Cost:** The UON Counselling Service is **free**.

**Drop-in Alternative:** If ineligible or waiting, consider the [Counselling & Mental Health drop-in](https://www.eventbrite.co.uk/e/counselling-and-mental-health-team-telephone-drop-in-tickets-101727260976?aff=oddtdtcreator).`,
    keywords: ['counselling', 'eligibility', 'cost', 'free', 'enrolled', 'abroad', 'drop-in', 'uon', 'university']
  },
  {
    id: 'faq-counselling-what-to-expect',
    title: 'What Happens in a Counselling Session?',
    category: 'Counselling FAQs',
    snippet: 'Learn about the process of a typical counselling session.',
    content: `## What happens in a Counselling Session?

Typically, you'll have an initial consultation to discuss your needs and goals. Subsequent sessions involve talking through your thoughts and feelings with the counsellor, who will listen without judgment and help you explore coping strategies and solutions.

**Confidentiality:** Sessions are confidential, except in specific circumstances involving risk of harm.

**Duration:** Sessions usually last 50 minutes.

**Frequency:** This varies depending on your needs, often weekly or bi-weekly.`,
    keywords: ['counselling', 'session', 'process', 'confidentiality', 'duration', 'frequency']
  },
  {
    id: 'faq-counselling-how-to-register',
    title: 'How Do I Register for Counselling?',
    category: 'Counselling FAQs',
    snippet: 'Steps to register for the University Counselling Service.',
    content: `## How Do I Register for Counselling?

1.  **Complete the Online Form:** You will usually need to fill out an online registration form available on the University's Counselling Service webpage.
2.  **Wait for Contact:** The service will contact you, typically via your university email, to schedule an initial consultation or provide further information.
3.  **Attend Consultation:** Attend the initial consultation to discuss your needs.

**Waiting Times:** Be aware there might be a waiting list, especially during busy periods. The service usually provides information on current waiting times.

**Find the Form:** Search for "Counselling Service" on the University website or student portal.`,
    keywords: ['counselling', 'register', 'sign up', 'form', 'consultation', 'waiting list']
  },
    {
    id: 'faq-counselling-types',
    title: 'What Types of Counselling are Offered?',
    category: 'Counselling FAQs',
    snippet: 'Overview of different counselling approaches available.',
    content: `## What Types of Counselling are Offered?

Universities often offer various therapeutic approaches. Common ones include:

*   **Person-Centred Therapy:** Focuses on your self-discovery and growth.
*   **Cognitive Behavioural Therapy (CBT):** Helps identify and change negative thought patterns and behaviours.
*   **Psychodynamic Therapy:** Explores how past experiences influence present feelings and behaviours.
*   **Integrative Therapy:** Combines elements from different approaches based on your needs.

The specific types available can vary. Check the Counselling Service website for details.`,
    keywords: ['counselling', 'types', 'approaches', 'cbt', 'person-centred', 'psychodynamic', 'integrative']
  },

  // --- Self-Help ---
  {
    id: 'selfhelp-anxiety-panic',
    title: 'Managing Anxiety & Panic Attacks',
    category: 'Self-Help',
    snippet: 'Understanding anxiety/panic and practical coping strategies.',
    content: \`## Understanding Anxiety & Panic

*   **Anxiety:** A normal feeling in difficult situations, but can become overwhelming.
*   **Panic Attack:** Intense physical/mental symptoms (sweating, racing heart, fear). Can affect 1 in 3 people.

## Ways to Manage

*   **Address Worries:** Seek advice if something is worrying you.
*   **Rest:** Avoid getting over-tired; take regular breaks.
*   **Breathing:** Slow down breathing (in for 4, out for 6). Breathing into cupped hands/paper bag can help restore balance if hyperventilating.
*   **Acceptance:** Remember anxiety feelings are normal and will pass.
*   **Learn:** Understand anxiety to reduce fear.
*   **Exams:** Apply for alternative arrangements via Mental Health Advisers ([mha@northampton.ac.uk](mailto:mha@northampton.ac.uk)) if needed.

## External Resources

*   **NHS:** [Every Mind Matters - Anxiety](https://www.nhs.uk/every-mind-matters/mental-health-issues/anxiety/)
*   **No Panic:** [Website & Helpline](https://www.nopanic.org.uk/)
*   **IAPT:** [NHS Talking Therapies](https://www.nhft.nhs.uk/iapt)
*   **Self-Help Booklets:** [Northumberland Tyne and Wear NHS](https://web.ntw.nhs.uk/selfhelp/)\`,
    keywords: ['anxiety', 'panic attack', 'stress', 'breathing exercise', 'coping', 'self-help', 'exams', 'worry']
  },
  {
    id: 'selfhelp-low-mood-depression',
    title: 'Understanding Low Mood & Depression',
    category: 'Self-Help',
    snippet: 'Recognising symptoms and finding ways to cope with low mood or depression.',
    content: \`## Understanding Low Mood & Depression

*   **Low Mood:** Feeling sad, worried, or fed up. Usually passes in time.
*   **Depression:** More intense, longer-lasting low mood impacting daily life. Can include feelings of hopelessness, low self-worth, lack of energy/interest, changes in sleep/appetite.

## Ways to Manage

*   **Talk:** Share feelings with trusted friends, family, or professionals.
*   **Stay Active:** Exercise releases endorphins and can boost mood.
*   **Healthy Diet:** Balanced meals can impact energy and mood.
*   **Routine:** Maintain a regular sleep schedule and daily structure.
*   **Small Goals:** Set achievable daily tasks to build a sense of accomplishment.
*   **Mindfulness:** Practice being present and observing thoughts without judgment.
*   **Challenge Negative Thoughts:** Question unhelpful thinking patterns.

## External Resources

*   **NHS:** [Every Mind Matters - Low Mood](https://www.nhs.uk/every-mind-matters/mental-health-issues/low-mood/)
*   **MIND:** [Information on Depression](https://www.mind.org.uk/information-support/types-of-mental-health-problems/depression/about-depression/)
*   **Students Against Depression:** [Website](https://www.studentsagainstdepression.org/)
*   **Self-Help Booklets:** [Northumberland Tyne and Wear NHS](https://web.ntw.nhs.uk/selfhelp/)\`,
    keywords: ['depression', 'low mood', 'sadness', 'hopelessness', 'coping', 'self-help', 'mental health', 'exercise', 'routine']
  },
    {
    id: 'selfhelp-sleep',
    title: 'Improving Your Sleep',
    category: 'Self-Help',
    snippet: 'Tips and resources for better sleep hygiene and managing sleep problems.',
    content: \`## Why Sleep Matters

Good sleep is crucial for physical and mental health, learning, and memory consolidation.

## Tips for Better Sleep

*   **Consistent Schedule:** Go to bed and wake up around the same time daily, even on weekends.
*   **Relaxing Routine:** Wind down before bed (e.g., warm bath, reading, gentle music). Avoid screens.
*   **Optimize Environment:** Dark, quiet, cool bedroom.
*   **Avoid Stimulants:** Limit caffeine and nicotine, especially in the evening. Avoid large meals or excessive fluids before bed.
*   **Exercise Regularly:** But avoid intense workouts close to bedtime.
*   **Manage Worries:** Write down concerns before bed or practice relaxation techniques.
*   **Get Up if You Can't Sleep:** If awake for >20 mins, get up, do something relaxing, and return when tired.

## External Resources

*   **NHS:** [Every Mind Matters - Sleep](https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/sleep/)
*   **The Sleep Charity:** [Website & Advice](https://thesleepcharity.org.uk/)
*   **Self-Help Booklets:** [Northumberland Tyne and Wear NHS - Sleeping Problems](https://web.ntw.nhs.uk/selfhelp/leaflets/Sleeping%20Problems.pdf)\`,
    keywords: ['sleep', 'insomnia', 'sleep hygiene', 'rest', 'schedule', 'routine', 'relaxation', 'self-help']
  },
  {
    id: 'selfhelp-stress',
    title: 'Managing Stress',
    category: 'Self-Help',
    snippet: 'Understanding stress and practical techniques for coping.',
    content: \`## Understanding Stress

Stress is the body's reaction to pressure or demands. A little stress can be motivating, but chronic stress impacts health.

## Ways to Manage Stress

*   **Identify Triggers:** Recognise what situations or thoughts cause stress.
*   **Time Management:** Prioritise tasks, break them down, learn to say no.
*   **Relaxation Techniques:** Practice deep breathing, mindfulness, meditation, or yoga.
*   **Physical Activity:** Regular exercise is a great stress reliever.
*   **Healthy Lifestyle:** Balanced diet, sufficient sleep, limit alcohol/caffeine.
*   **Talk About It:** Share feelings with friends, family, or a professional.
*   **Take Breaks:** Schedule short breaks during study or work.
*   **Hobbies & Interests:** Make time for enjoyable activities.

## External Resources

*   **NHS:** [Every Mind Matters - Stress](https://www.nhs.uk/every-mind-matters/mental-health-issues/stress/)
*   **MIND:** [How to Manage Stress](https://www.mind.org.uk/information-support/types-of-mental-health-problems/stress/what-is-stress/)
*   **Self-Help Booklets:** [Northumberland Tyne and Wear NHS - Stress](https://web.ntw.nhs.uk/selfhelp/leaflets/Stress.pdf)\`,
    keywords: ['stress', 'pressure', 'coping', 'management', 'relaxation', 'time management', 'mindfulness', 'self-help', 'wellbeing']
  },

  // --- Crisis Support ---
  {
    id: 'crisis-support-immediate-help',
    title: 'Need Help in a Crisis?',
    category: 'Crisis Support',
    snippet: 'Urgent support contacts for mental health crises.',
    content: \`## Immediate Help Needed?

**If you or someone else is in immediate danger, call 999 (UK).**

This chatbot cannot provide crisis intervention. Please reach out to professional services immediately.

## Urgent Support Contacts (UK)

*   **NHS Mental Health Hub (Northamptonshire - 24/7):** 0800 448 0828
*   **Samaritans (24/7):** Call 116 123 (Free, confidential listening)
*   **Shout (24/7 Text Service):** Text 'IMATTER' to 85258 (Free, confidential)
*   **Spectrum Life (UON 24/7 Support):** [Login](https://universityofnorthampton.spectrum.life/login) (Code: UONWELL), UK Freephone: 0800 031 8227
*   **Your GP:** Contact your doctor for an urgent appointment.
*   **NHS 111:** Call 111 if you need urgent medical help/advice but it's not a 999 emergency.
*   **Papyrus HOPELINEUK (Under 35s suicidal thoughts):** Call 0800 068 4141 (9am-midnight), Text 07860 039967, Email [pat@papyrus-uk.org](mailto:pat@papyrus-uk.org)

## If You Spoke to the Chatbot About Crisis:

The chatbot is designed to recognise distress and will direct you to these resources. It cannot provide therapy or ongoing support in a crisis situation. Please contact one of the services above.\`,
    keywords: ['crisis', 'urgent help', 'emergency', 'suicide', 'self-harm', 'support lines', 'nhs', 'samaritans', 'shout', 'spectrum life', 'papyrus', 'hotline', 'immediate danger']
  },

  // --- Counsellors Corner ---
  {
    id: 'counsellor-corner-loneliness',
    title: 'Loneliness vs. Being Alone (Nov 2024)',
    category: 'Counsellors Corner',
    snippet: 'Understanding the difference and finding ways to connect.',
    content: \`## Being Alone vs. Feeling Lonely (Nov 2024)

*   **Being Alone:** Physical solitude (can be a choice or circumstance).
*   **Feeling Lonely:** Subjective emotional experience (emptiness, sadness, longing for connection), can happen even when surrounded by others.

## Ideas for Bridging the Gap

*   **Lean into Loneliness:** Explore what it means to *you*. Practice mindfulness ([Frantic World Meditations](https://franticworld.com/free-meditations-from-mindfulness/)).
*   **Embrace Aloneness:** Reframe solitude as nourishing, an opportunity for growth.
*   **Reconnect with Yourself:** Understand your passions, needs, values.
*   **Practice Self-Compassion:** Be kind to yourself ([Dr. Kristin Neff](https://self-compassion.org/)).
*   **Validate & Express Feelings:** Name your emotions. Try journaling ([WRITE method](https://journaltherapy.com/)).
*   **Stay Connected:** Reach out to friends/family. Join clubs/groups. Start small ([Side by Side - Mind](https://sidebyside.mind.org.uk/)).
*   **Review Social Media Use:** Does it nourish or deplete you? Adjust accordingly.

## Further Support

*   [UON Student Hub Support & Wellbeing](https://mynorthamptonac.sharepoint.com/sites/student/support-and-wellbeing) (Link assumes UON internal site)
*   [Spectrum Life](https://universityofnorthampton.spectrum.life/login) (Code: UONWELL)
*   [UON Drop-in Appointments](https://www.eventbrite.co.uk/e/counselling-and-mental-health-team-telephone-drop-in-tickets-101727260976?aff=oddtdtcreator)
*   [NHS - Loneliness](https://www.nhs.uk/every-mind-matters/lifes-challenges/loneliness/)
*   [MIND - Loneliness](https://www.mind.org.uk/information-support/tips-for-everyday-living/loneliness/about-loneliness/)
*   [Podcast: Brené Brown & Dr Vivek Murthy](https://brenebrown.com/podcast/dr-vivek-murthy-and-brene-on-loneliness-and-connection)\`,
    keywords: ['loneliness', 'alone', 'connection', 'mindfulness', 'self-compassion', 'journaling', 'social media', 'support', 'counsellors corner']
  },
  {
    id: 'counsellor-corner-perfectionism',
    title: 'Understanding Perfectionism (Jul 2024)',
    category: 'Counsellors Corner',
    snippet: 'Exploring the impact of perfectionism and strategies for managing it.',
    content: \`## Understanding Perfectionism (Jul 2024)

Perfectionism involves setting excessively high standards and being overly critical of oneself. While striving for excellence is good, perfectionism can lead to anxiety, procrastination, and burnout.

**Signs:**
*   Fear of failure
*   All-or-nothing thinking
*   Difficulty delegating
*   Procrastination (due to fear of not meeting standards)
*   Excessive checking/revising

## Strategies for Management

*   **Challenge Perfectionist Thoughts:** Recognise and question unrealistic expectations.
*   **Set Realistic Goals:** Focus on progress, not perfection.
*   **Embrace Mistakes as Learning:** View errors as opportunities for growth.
*   **Practice Self-Compassion:** Treat yourself with kindness when you fall short.
*   **Focus on the Process:** Enjoy the journey rather than fixating solely on the outcome.
*   **Mindfulness:** Stay present and reduce self-critical thoughts.

## Further Support

*   University Counselling Service
*   [Self-Compassion Resources](https://self-compassion.org/)
*   Books like "Mind Over Mood" or "The Gifts of Imperfection"\`,
    keywords: ['perfectionism', 'high standards', 'self-criticism', 'anxiety', 'procrastination', 'burnout', 'self-compassion', 'mindfulness', 'counsellors corner']
  },

  // --- Uni Events & Resources ---
  {
    id: 'resource-umhd',
    title: 'University Mental Health Day',
    category: 'Uni Events & Resources',
    snippet: 'Information about the annual event promoting student mental health.',
    content: \`## University Mental Health Day

This is a national event in Higher Education focusing on raising awareness, challenging stigma, and promoting conversations about student and staff mental health.

**Next Event:** Thursday 13 March 2025 (Learning Hub, 10am-3pm - *Check for confirmation closer to date*)

**Typical Activities (may vary):**
*   Information stalls (Uni teams & external orgs)
*   Therapy animals (petting zoo, PAT dogs)
*   Wellbeing activities (meditation, crafts, games)
*   Free refreshments ('Take a Break Café')
*   Workshops and talks

**Stay Updated:** Check campus screens, university event pages, and student newsletters for specific details.

**General UON Support:** [Counselling and Mental Health pages](https://mynorthamptonac.sharepoint.com/sites/student/Pages/counselling-and-mental-health.aspx) (Link assumes UON internal site)\`,
    keywords: ['university mental health day', 'umhd', 'event', 'awareness', 'stigma', 'wellbeing', 'support', 'campus event']
  },

  // --- Mental Health Blog ---
  {
    id: 'blog-eating-disorder',
    title: 'Eating Disorder Awareness & Support (Feb 2025)',
    category: 'Mental Health Blog',
    snippet: 'Recognising signs and finding help for eating disorders.',
    content: \`## Eating Disorder Awareness (Feb 2025 Blog)

Eating Disorders can be hard to spot and impact anyone.

*   **Think you might have one?** Check [Beat - Do I have an eating disorder?](https://www.beateatingdisorders.org.uk/get-information-and-support/about-eating-disorders/do-i-have-an-eating-disorder/)
*   **Supporting someone?** [Beat - Tips for supporting someone](https://www.beateatingdisorders.org.uk/get-information-and-support/support-someone-else/tips-for-supporting-somebody-with-an-eating-disorder/)

## Beat Helplines (Check website for current hours)
*   England: 0808 801 0677
*   Scotland: 0808 801 0432
*   Wales: 0808 801 0433
*   Northern Ireland: 080 801 0434

Read Amelie's story: [Beat Helpline Appeal](https://www.beateatingdisorders.org.uk/helplineappeal/)

**UON Self-Help Resources:** [Eating Problems and Eating Disorders](https://mynorthamptonac.sharepoint.com/sites/student/Pages/eating-problems-and-eating-disorders.aspx) (Link assumes UON internal site)\`,
    keywords: ['eating disorder', 'beat', 'support', 'helpline', 'awareness', 'body image', 'anorexia', 'bulimia', 'binge eating', 'blog']
  },
  {
    id: 'blog-spectrum-life',
    title: 'Spectrum Life: 24/7 Student Support (Oct 2024)',
    category: 'Mental Health Blog',
    snippet: 'Access free, confidential support anytime via phone, WhatsApp, or online.',
    content: \`## Spectrum.Life (Introduced Oct 2024)

This platform provides 24/7 access to a range of health and wellbeing resources, additional to existing University support.

**Services Include:**
*   **24/7 Mental Health Support:** Access counsellors and mental health professionals via phone or WhatsApp (over 200 languages).
*   **Physical Health Resources:** Fitness plans, workout guides, nutrition advice.
*   **Wellbeing Webinars & Workshops:** Sessions on stress management, mindfulness, etc.

**How to Access:**
*   **Website:** [universityofnorthampton.spectrum.life](https://universityofnorthampton.spectrum.life/login)
*   **Organisation Code:** UONWELL
*   **UK Freephone:** 0800 031 8227
*   **WhatsApp:** Text 'Hi' to 074 1836 0780

Use this while waiting for uni appointments, outside working hours, or for general wellbeing tips.\`,
    keywords: ['spectrum life', '24/7 support', 'helpline', 'counselling', 'wellbeing', 'fitness', 'workshops', 'confidential', 'blog', 'uon']
  },
  {
    id: 'blog-self-care-importance',
    title: 'The Importance of Self-Care (May 2024)',
    category: 'Mental Health Blog',
    snippet: 'Understanding what self-care is and why it matters for students.',
    content: \`## Why Self-Care Matters (May 2024 Blog)

Self-care isn't selfish; it's essential for maintaining mental and physical wellbeing, especially during stressful periods like university.

**What is Self-Care?**
It's any activity we do deliberately to take care of our mental, emotional, and physical health. It looks different for everyone.

**Examples:**
*   **Physical:** Getting enough sleep, eating nutritious food, moving your body.
*   **Emotional:** Journaling, talking to a friend, setting boundaries, practicing mindfulness.
*   **Social:** Spending time with loved ones, joining a club, limiting draining interactions.
*   **Mental:** Reading, learning something new, engaging in hobbies, taking breaks from study.

**Making Time:**
*   Schedule small self-care activities into your day/week.
*   Start small - even 5-10 minutes can make a difference.
*   Be kind to yourself if you miss a day.

**Remember:** Self-care helps prevent burnout and improves your ability to cope with challenges.\`,
    keywords: ['self-care', 'wellbeing', 'mental health', 'burnout', 'stress management', 'relaxation', 'hobbies', 'boundaries', 'blog']
  },

  // --- Chatbot FAQs ---
  {
    id: 'faq-chatbot-capabilities',
    title: 'What Can This Chatbot Do?',
    category: 'Chatbot FAQs',
    snippet: 'Overview of the chatbot\'s functions and limitations.',
    content: \`## Chatbot Capabilities

This chatbot is designed to:

*   Provide information about university mental health resources (based on its knowledge).
*   Offer general information on common mental health topics (e.g., anxiety, stress).
*   Direct you to relevant self-help materials and support services.
*   Answer frequently asked questions about university services (like counselling eligibility).
*   Recognise expressions of distress and provide immediate crisis contact information.

**Limitations:**
*   **Not a Therapist:** Cannot provide counselling, diagnosis, or treatment.
*   **Not for Emergencies:** Cannot handle immediate crises (directs to crisis lines).
*   **Knowledge Limit:** Information is based on the data it was trained on (primarily UON resources provided). It may not have real-time updates or info outside its scope.
*   **Doesn't Remember:** Conversations are typically stateless unless specific features are built for context memory within a session.\`,
    keywords: ['chatbot', 'capabilities', 'functions', 'limitations', 'faq', 'ai', 'resources', 'support']
  },
  {
    id: 'faq-chatbot-confidentiality',
    title: 'Is My Conversation Confidential?',
    category: 'Chatbot FAQs',
    snippet: 'Information about the privacy and confidentiality of chatbot interactions.',
    content: \`## Chatbot Confidentiality & Privacy

*   **General Principle:** Chatbot interactions should be treated with a degree of privacy, but are typically not confidential in the same way as talking to a human counsellor.
*   **Data Usage:** Conversations *may* be logged anonymously for purposes like:
    *   Improving the chatbot's performance and accuracy.
    *   Identifying common user needs and resource gaps.
    *   Training the AI model.
*   **No Personal Identification:** Logs are usually anonymised, meaning they are not linked to your specific name or student ID unless you explicitly provide such information.
*   **Crisis Exception:** If you express clear intent to harm yourself or others, safety protocols might involve escalation, though the chatbot itself cannot directly intervene.

**Recommendation:** Avoid sharing highly sensitive personal details (like specific trauma details, names of others involved in personal issues) that you would only share in a confidential therapeutic setting.\`,
    keywords: ['chatbot', 'confidentiality', 'privacy', 'data', 'logging', 'anonymised', 'security', 'faq']
  },
  {
    id: 'faq-chatbot-crisis', // Note: Content merged/updated with crisis-support entry
    title: 'Chatbot & Crisis Support Handling',
    category: 'Chatbot FAQs',
    snippet: 'How the chatbot handles mental health crises and where to get urgent help.',
    content: \`## Chatbot Role in Crisis

This chatbot can provide information and direct you to resources, but **it cannot provide immediate crisis intervention or counselling.**

**If you ask about crisis or self-harm:**
*   The chatbot is designed to acknowledge your distress.
*   It will strongly recommend contacting professional crisis services immediately.
*   It will provide contact information for urgent support (like those listed in the 'Crisis Support' section).

**Key Phrases Triggering Crisis Response:**
*   "I feel like I'm going to hurt myself."
*   "I need help right now."
*   "I'm having a mental health crisis."
*   Mentions of suicide or specific self-harm methods.

**Refer to the 'Crisis Support' category for a full list of urgent contacts.**\`,
    keywords: ['chatbot', 'crisis', 'urgent help', 'emergency', 'suicide', 'self-harm', 'support lines', 'faq', 'response']
  },
]; 