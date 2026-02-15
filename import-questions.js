const fs = require('fs');
const path = require('path');

const inputPath = '50_Pertanyaan_Unik_Jawaban_Panjang_Sidang_Skripsi_UIUX_HiSales.txt';
const outputPath = 'data/questions.ts';

try {
    const data = fs.readFileSync(inputPath, 'utf8');
    // Normalize line endings and split
    // Handle CR, CRLF, and LF
    const lines = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').map(l => l.trim()).filter(line => line !== '');

    console.log('Total lines:', lines.length);
    console.log('First 10 lines:', lines.slice(0, 10));

    // Attempt to detect if the first line is Number/Header
    // If the first line is "No", we skip 5 lines (headers)
    // If the first line is "1" (number), we start immediately
    let startIndex = 0;
    if (lines[0].toLowerCase() === 'no' || lines[0] === 'No') {
        startIndex = 5;
    }

    const questions = [];
    let currentRecord = null;
    let buffer = [];

    // Helper to finalize a record
    const finalizeRecord = () => {
        if (currentRecord) {
            // We have collected all lines for the previous record.
            // Structure should be:
            // 0: No (we already parsed this to start the record)
            // 1: Bab
            // 2: Aspek
            // 3: Pertanyaan (might be multi-line)
            // 4: Jawaban (might be multi-line)

            // However, simply accumulating lines in a buffer is tricky if we don't know how many lines belong to each field.
            // Let's assume the order is fixed: Bab, Aspek, Pertanyaan, Jawaban.
            // But if Pertanyaan spans 2 lines, how do we distinguish it from Jawaban?
            // Looking at the hex dump and file content:
            // 1
            // I
            // Latar Belakang
            // Apa alasan...
            // Alasan utama...
            // 2 (Next ID)

            // So we can assume:
            // Line 0: ID
            // Line 1: Bab
            // Line 2: Aspek
            // Line 3: Pertanyaan
            // Line 4+: Answer (everything until next ID)

            // Wait, what if Pertanyaan is multi-line? 
            // Based on the file content "Apa alasan utama...?" it seems to be 1 line.
            // Let's assume standard fields (Bab, Aspek) are 1 line.
            // Question is likely 1 line (it ends with ? usually).
            // Answer is the rest.

            if (buffer.length >= 4) {
                const id = currentRecord;
                // buffer[0] is Bab
                // buffer[1] is Aspek
                // buffer[2] is Pertanyaan
                // buffer[3...] is Answer joined together

                const answer = buffer.slice(3).join(' ');

                questions.push({
                    id: parseInt(id),
                    question: buffer[2],
                    answer: answer
                });
            }
        }
    };

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check if line is a number (start of new record)
        if (/^\d+$/.test(line)) {
            finalizeRecord();
            currentRecord = line;
            buffer = [];
        } else {
            // It's content
            if (currentRecord !== null) {
                buffer.push(line);
            }
        }
    }

    // Finalize last record (Format 1)
    finalizeRecord();

    // --- Parse File 2: Pertanyaan.txt ---
    const inputPath2 = 'Pertanyaan.txt';
    try {
        if (fs.existsSync(inputPath2)) {
            const data2 = fs.readFileSync(inputPath2, 'utf8');

            // Normalize content: replace newlines/CRs with space, collapse multiple spaces
            const normalizedData = data2.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();

            // Regex to find "Number" followed by "Uppercase Letter"
            // Insert delimiter. Handle optional space between number and letter.
            const delimiter = '###SPLIT###';

            // Use regex that allows whitespace: (\d+)\s*([A-Z])
            // Replace with delimiter + number + space + letter
            const cleanedData = normalizedData.replace(/(\d+)\s*([A-Z])/g, `${delimiter}$1 $2`);

            const chunks2 = cleanedData.split(delimiter).filter(c => c.trim() !== '');

            chunks2.forEach(chunk => {
                const match = chunk.match(/^(\d+)(.+)$/);
                if (match) {
                    // id is match[1]
                    // content is match[2] -> "Fokus UI/UXMengapa..."

                    const id = parseInt(match[1]);
                    const content = match[2];

                    // Separate Topic, Question, Answer
                    // Find the Question Mark
                    const qMarkIndex = content.indexOf('?');
                    if (qMarkIndex !== -1) {
                        const topicAndQuestion = content.substring(0, qMarkIndex + 1);
                        const answer = content.substring(qMarkIndex + 1);

                        // Split Topic and Question
                        // Heuristic: Find first common question word
                        const questionWords = ['Mengapa', 'Apa', 'Bagaimana', 'Apakah', 'Jelaskan', 'Sebutkan', 'Dimana', 'Kapan', 'Siapa'];
                        let splitIndex = -1;

                        for (const word of questionWords) {
                            const idx = topicAndQuestion.indexOf(word);
                            if (idx !== -1) {
                                // We found a question word.
                                // But check if it's the *start* of the question part.
                                // Usually Topic is before it.
                                // Pick the *first* occurrence of any question word?
                                // "Fokus UI/UXMengapa" -> index of Mengapa is 11.

                                // We take the earliest position found among all keywords
                                if (splitIndex === -1 || idx < splitIndex) {
                                    splitIndex = idx;
                                }
                            }
                        }

                        let questionText = topicAndQuestion;
                        // If we found a split point, use it. 
                        if (splitIndex !== -1) {
                            questionText = topicAndQuestion.substring(splitIndex);
                        }

                        questions.push({
                            id: questions.length + 1, // Assign new sequential ID
                            question: questionText,
                            answer: answer
                        });
                    }
                }
            });
            console.log(`Parsed ${chunks2.length} items from ${inputPath2}`);
        }
    } catch (err2) {
        console.error('Error reading/parsing Pertanyaan.txt:', err2);
    }


    // Deduplicate questions based on question text
    const uniqueQuestions = [];
    const seenQuestions = new Set();

    // Simple Indonesian stop words list for keyword extraction
    const stopWords = new Set([
        'yang', 'dan', 'di', 'dari', 'itu', 'dengan', 'ini', 'untuk', 'adalah', 'tidak', 'akan', 'pada', 'juga',
        'karena', 'dalam', 'saya', 'kita', 'kami', 'mereka', 'ada', 'secara', 'agar', 'bisa', 'dapat', 'saat',
        'oleh', 'sebagai', 'namun', 'hal', 'tersebut', 'menjadi', 'bagi', 'serta', 'atau', 'maka', 'jika',
        'tentang', 'apakah', 'mengapa', 'bagaimana', 'harus', 'perlu', 'telah', 'sedang', 'masih', 'bukan',
        'hanya', 'sangat', 'lebih', 'sudah', 'tapi', 'ke', 'ya', 'seperti', 'yaitu', 'contoh'
    ]);

    const generateHint = (answer) => {
        // Remove punctuation and split
        const words = answer.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().split(/\s+/);

        // Filter stop words and short words
        const keywords = words.filter(w => !stopWords.has(w) && w.length > 3);

        // Pick top unique keywords (heuristic: longest or just first few relevant ones?)
        // Let's pick the first 3-5 unique keywords to form a hint
        const uniqueKeywords = [...new Set(keywords)].slice(0, 5);

        if (uniqueKeywords.length === 0) return "Think about the core concept.";

        return "Clue phrases: " + uniqueKeywords.join(", ");
    };

    questions.forEach(q => {
        // Normalize question text for comparison (trim and lowercase)
        const normalizedQ = q.question.trim().toLowerCase();

        if (!seenQuestions.has(normalizedQ)) {
            seenQuestions.add(normalizedQ);

            // Add Hint
            q.hint = generateHint(q.answer);

            // Re-assign ID to be sequential
            q.id = uniqueQuestions.length + 1;
            uniqueQuestions.push(q);
        }
    });

    const content = `export const questions = ${JSON.stringify(uniqueQuestions, null, 2)};`;

    fs.writeFileSync(outputPath, content);
    console.log(`Successfully converted ${uniqueQuestions.length} unique questions to ${outputPath}`);

} catch (err) {
    console.error('Error:', err);
}
