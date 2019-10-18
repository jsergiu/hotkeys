// Get the index of the second occurance of a letter
function getDuplicateIndex(letter, hotkeys) {
  let count = 0

  for (let i = 0; i < hotkeys.length; i++) {
    if (hotkeys[i] === letter) {
      count++
    }
    if (count > 1) {
      return i
    }
  }

  return -1
}

// For each word return the letter at the position specified in arrayOfIndexes
// Example hotkeysFromLetterIndexes(['abc', 'cbb'], [1, 0]) => ['b', 'c']
function hotkeysFromLetterIndexes(words, arrayOfIndexes) {
  return words.map((word, index) => {
    return word.split('')[arrayOfIndexes[index]]
  })
}

// Genetare a list of hotkeys for an array of words
function getHotkeysFromWords(words) {

  // Validate input
  if (!Array.isArray(words)) {
      throw new Error('words is not an array');
  }

  // Size of the input array
  const SIZE = words.length;

  // Represent the index of the letter used as a hotkey for each word
  // Starts as [0, 0, 0, ...]
  const arrayOfIndexes = words.map(word => 0);

  // Initialize hotkeys with the first letter of each word
  let hotkeys = hotkeysFromLetterIndexes(words, arrayOfIndexes);

  // Loop the array of hotkeys, check and solve duplicates
  for (let i = 0; i < SIZE; i++) {
    const currentLetter = hotkeys[i];
    const currentWord = words[i];
    let duplicateWord;
    let isDuplicate;
    
    // Check if current letter has more than one occurences
    const duplicateIndex = getDuplicateIndex(currentLetter, hotkeys)
    if (duplicateIndex > -1) {
      isDuplicate = true;
      duplicateWord = words[duplicateIndex];
      
      // We try all the letters of the second word
      while (arrayOfIndexes[duplicateIndex] < duplicateWord.length - 1 && isDuplicate > -1) {
        // Increase the letter index of the coresponding word
        arrayOfIndexes[duplicateIndex]++;

        // Generate a new array of hotkeys
        hotkeys = hotkeysFromLetterIndexes(words, arrayOfIndexes);

        // We test if the new choosen hotkey is a duplicate
        const newHotkey = duplicateWord[arrayOfIndexes[duplicateIndex]];
        isDuplicate = getDuplicateIndex(newHotkey, hotkeys);
      }


      // If there are still duplicate after trying all letters of the duplicate word
      // We try all the letters of the current word (word at the current index)
      if (isDuplicate > -1) {
        arrayOfIndexes[duplicateIndex] = 0; // Reset the hotkey to the first letter for the duplicate word

        
        while (arrayOfIndexes[i] < currentWord.length - 1 && isDuplicate) {
          // Increase the letter index of the coresponding word
          arrayOfIndexes[i]++;

          // Generate a new array of hotkeys
          hotkeys = hotkeysFromLetterIndexes(words, arrayOfIndexes);

          // We test if the new choosen hotkey is a duplicate
          const newHotkey = currentWord[arrayOfIndexes[i]]
          isDuplicate = getDuplicateIndex(newHotkey, hotkeys);
        }
      }

      // If we still have duplicates after trying all letters from both words
      // then we don't have a sollution. We could shuffle other hotkeys until we get somewhere
      if (isDuplicate > -1) {
        throw new Error('No sollution found');
      }
    }      
  }
  
  return hotkeys
}

function test(input, output) {
  const out = getHotkeysFromWords(input)
  const success = out.join('') === output.join('')
  console.log(success ? 'Test passed' : 'Test failed')
} 

// Few test cases
test(['fly', 'doom', 'tree'], ['f', 'd', 't'])
test(['fly', 'form', 'car'], ['f', 'o', 'c'])
test(['abc', 'aaa', 'bbb'], ['c', 'a', 'b'])
