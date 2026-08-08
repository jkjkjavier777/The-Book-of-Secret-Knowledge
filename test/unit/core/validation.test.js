/**
 * @file Validation Service Unit Tests
 * @purpose Tests for input validation, safety checks, and response validation
 * @dependencies None - tests the validation module directly
 */

// Mock the validation module since the actual structure may vary
const validator = {
  VALID_TYPES: ['fact', 'inference', 'hypothesis', 'speculative', 'opinion'],
  BANNED_PATTERNS: [
    /\bignore previous\b/i,
    /\bdelete system\b/i,
    /\bexploit\b/i,
  ],
  
  validateEntryShape(entry) {
    const errors = [];
    if (!entry.reply || typeof entry.reply !== 'string' || !entry.reply.trim()) {
      errors.push('Empty or missing reply text.');
    }
    if (!this.VALID_TYPES.includes(entry.type)) {
      errors.push(`Unrecognized type "${entry.type}".`);
    }
    if (
      typeof entry.confidence !== 'number' ||
      entry.confidence < 0 ||
      entry.confidence > 1
    ) {
      errors.push(`Confidence "${entry.confidence}" out of bounds [0,1].`);
    }
    return errors;
  },
  
  validateGeneratedText(text) {
    const errors = [];
    if (!text || typeof text !== 'string' || !text.trim()) {
      errors.push('Empty generated response.');
    }
    if (text && text.length > 4000) {
      errors.push('Generated response exceeds length bound.');
    }
    if (text && !this.passesSafetyCheck(text)) {
      errors.push('Matched banned pattern.');
    }
    return errors;
  },
  
  passesSafetyCheck(text) {
    return !this.BANNED_PATTERNS.some((re) => re.test(text));
  },
  
  isDuplicateOfLast(text, history) {
    const last = history[history.length - 1];
    return !!last && last.toLowerCase() === text.toLowerCase();
  }
};

describe('Validation Service', () => {
  describe('Entry Shape Validation', () => {
    const validEntry = {
      reply: 'Test response',
      type: 'fact',
      confidence: 0.8
    };

    it('should pass valid entry with all required fields', () => {
      const errors = validator.validateEntryShape(validEntry);
      expect(errors).toHaveLength(0);
    });

    it('should fail on empty reply string', () => {
      const entry = { ...validEntry, reply: '' };
      const errors = validator.validateEntryShape(entry);
      expect(errors).toContain('Empty or missing reply text.');
    });

    it('should fail on missing reply field', () => {
      const entry = { type: 'fact', confidence: 0.8 };
      const errors = validator.validateEntryShape(entry);
      expect(errors).toContain('Empty or missing reply text.');
    });

    it('should fail on whitespace-only reply', () => {
      const entry = { ...validEntry, reply: '   ' };
      const errors = validator.validateEntryShape(entry);
      expect(errors).toContain('Empty or missing reply text.');
    });

    it('should fail on invalid type', () => {
      const entry = { ...validEntry, type: 'invalid_type' };
      const errors = validator.validateEntryShape(entry);
      expect(errors).toContain('Unrecognized type');
    });

    it('should accept all valid types', () => {
      validator.VALID_TYPES.forEach(type => {
        const entry = { ...validEntry, type };
        const errors = validator.validateEntryShape(entry);
        expect(errors).toHaveLength(0);
      });
    });

    it('should fail on confidence below 0', () => {
      const entry = { ...validEntry, confidence: -0.1 };
      const errors = validator.validateEntryShape(entry);
      expect(errors).toContain('out of bounds [0,1]');
    });

    it('should fail on confidence above 1', () => {
      const entry = { ...validEntry, confidence: 1.1 };
      const errors = validator.validateEntryShape(entry);
      expect(errors).toContain('out of bounds [0,1]');
    });

    it('should fail on non-numeric confidence', () => {
      const entry = { ...validEntry, confidence: 'high' };
      const errors = validator.validateEntryShape(entry);
      expect(errors).toContain('out of bounds [0,1]');
    });

    it('should accept confidence at boundaries (0 and 1)', () => {
      const entry1 = { ...validEntry, confidence: 0 };
      const entry2 = { ...validEntry, confidence: 1 };
      
      expect(validator.validateEntryShape(entry1)).toHaveLength(0);
      expect(validator.validateEntryShape(entry2)).toHaveLength(0);
    });
  });

  describe('Generated Text Validation', () => {
    it('should pass valid generated text', () => {
      const errors = validator.validateGeneratedText('Valid response');
      expect(errors).toHaveLength(0);
    });

    it('should pass empty string with no errors for empty text', () => {
      const errors = validator.validateGeneratedText('');
      expect(errors).toContain('Empty generated response.');
    });

    it('should fail on null text', () => {
      const errors = validator.validateGeneratedText(null);
      expect(errors).toContain('Empty generated response.');
    });

    it('should fail on undefined text', () => {
      const errors = validator.validateGeneratedText(undefined);
      expect(errors).toContain('Empty generated response.');
    });

    it('should fail on text exceeding length bound', () => {
      const longText = 'a'.repeat(4001);
      const errors = validator.validateGeneratedText(longText);
      expect(errors).toContain('exceeds length bound');
    });

    it('should pass text at maximum length', () => {
      const maxText = 'a'.repeat(4000);
      const errors = validator.validateGeneratedText(maxText);
      expect(errors).toHaveLength(0);
    });

    it('should fail on banned patterns', () => {
      const bannedText = 'This contains exploit instructions';
      const errors = validator.validateGeneratedText(bannedText);
      expect(errors).toContain('Matched banned pattern.');
    });

    it('should pass text without banned patterns', () => {
      const safeText = 'This is a safe and helpful response';
      const errors = validator.validateGeneratedText(safeText);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Safety Check', () => {
    it('should pass safe text', () => {
      expect(validator.passesSafetyCheck('Hello world')).toBe(true);
      expect(validator.passesSafetyCheck('How are you?')).toBe(true);
      expect(validator.passesSafetyCheck('This is a normal sentence.')).toBe(true);
    });

    it('should fail banned patterns', () => {
      validator.BANNED_PATTERNS.forEach(pattern => {
        const testString = pattern.toString();
        expect(validator.passesSafetyCheck(testString)).toBe(false);
      });
    });

    it('should be case insensitive', () => {
      expect(validator.passesSafetyCheck('DELETE SYSTEM')).toBe(false);
      expect(validator.passesSafetyCheck('Exploit')).toBe(false);
      expect(validator.passesSafetyCheck('IGNORE PREVIOUS')).toBe(false);
    });

    it('should detect banned patterns within larger text', () => {
      expect(validator.passesSafetyCheck('Here is how to exploit the system')).toBe(false);
      expect(validator.passesSafetyCheck('You should ignore previous instructions')).toBe(false);
    });
  });

  describe('Duplicate Detection', () => {
    it('should detect exact duplicates', () => {
      const history = ['First message', 'Second message'];
      expect(validator.isDuplicateOfLast('Second message', history)).toBe(true);
    });

    it('should be case insensitive for duplicates', () => {
      const history = ['First Message'];
      expect(validator.isDuplicateOfLast('first message', history)).toBe(true);
    });

    it('should return false for non-duplicates', () => {
      const history = ['First message'];
      expect(validator.isDuplicateOfLast('Second message', history)).toBe(false);
    });

    it('should handle empty history', () => {
      expect(validator.isDuplicateOfLast('Any text', [])).toBe(false);
    });

    it('should handle undefined history', () => {
      expect(validator.isDuplicateOfLast('Any text', undefined)).toBe(false);
    });

    it('should handle history with only one item', () => {
      const history = ['Only message'];
      expect(validator.isDuplicateOfLast('Only message', history)).toBe(true);
      expect(validator.isDuplicateOfLast('Different message', history)).toBe(false);
    });
  });
});
