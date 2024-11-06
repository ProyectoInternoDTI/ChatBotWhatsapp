export default function capitalizeFirstWord(sentence: string): string {

    const words = sentence.trim().split(/\s+/);

    if (words.length === 0) {
        return "";
    }

    const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();

    const restOfWords = words.slice(1).map(word => word.toLowerCase());

    return [firstWord, ...restOfWords].join(' ');
}