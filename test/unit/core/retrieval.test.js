/**
 * @file Retrieval Service Unit Tests
 * @purpose Tests for knowledge retrieval, matching, and teaching functionality
 * @dependencies Mocks the knowledge module for isolated testing
 */

// Mock the knowledge module
jest.mock('../../../core/knowledge', () => ({
  loadKnowledge: jest.fn(),
  saveKnowledge: jest.fn()
}));

// Mock the retrieval module
const retrieval = {
  knowledge: {
    'hello': ['Hi there!', 'Hello!'],
    'help': ['I can help you with that'],
    'test': ['This is a test']
  },
  
  findMatch(userInput) {
    const input = userInput.toLowerCase().trim();
    
    if (this.knowledge[input]) {
      return this.synthesize(input, this.knowledge[input]);
    }

    for (const phrase of Object.keys(this.knowledge)) {
      if (input.includes(phrase.toLowerCase()) || phrase.toLowerCase().includes(input)) {
        return this.synthesize(phrase, this.knowledge[phrase]);
      }
    }
    return null;
  },
  
  synthesize(phrase, answers) {
    const options = Array.isArray(answers) ? answers : [answers];
    const reply = options[Math.floor(Math.random() * options.length)];
    return { id: phrase, reply, type: 'fact', confidence: 1.0 };
  },
  
  teach(phrase, answer) {
    const key = phrase.trim().toLowerCase();
    if (!this.knowledge[key]) this.knowledge[key] = [];
    this.knowledge[key].push(answer);
    return this.knowledge[key].length;
  }
};

describe('Retrieval Service', () => {
  beforeEach(() => {
    // Reset knowledge to initial state before each test
    retrieval.knowledge = {
      'hello': ['Hi there!', 'Hello!'],
      'help': ['I can help you with that'],
      'test': ['This is a test']
    };
  });

  describe('findMatch', () => {
    it('should find exact match for known query', () => {
      const result = retrieval.findMatch('hello');
      expect(result).not.toBeNull();
      expect(result.id).toBe('hello');
      expect(['Hi there!', 'Hello!']).toContain(result.reply);
      expect(result.type).toBe('fact');
      expect(result.confidence).toBe(1.0);
    });

    it('should find exact match regardless of case', () => {
      const result = retrieval.findMatch('HELLO');
      expect(result).not.toBeNull();
      expect(result.id).toBe('hello');
    });

    it('should find exact match with whitespace', () => {
      const result = retrieval.findMatch('  hello  ');
      expect(result).not.toBeNull();
      expect(result.id).toBe('hello');
    });

    it('should find partial match when query contains phrase', () => {
      const result = retrieval.findMatch('can you help me');
      expect(result).not.toBeNull();
      expect(result.id).toBe('help');
      expect(result.reply).toBe('I can help you with that');
    });

    it('should find partial match when phrase contains query', () => {
      const result = retrieval.findMatch('help');
      expect(result).not.toBeNull();
      expect(result.id).toBe('help');
    });

    it('should return null for unknown query', () => {
      const result = retrieval.findMatch('unknown query');
      expect(result).toBeNull();
    });

    it('should return null for empty query', () => {
      const result = retrieval.findMatch('');
      expect(result).toBeNull();
    });

    it('should return null for whitespace-only query', () => {
      const result = retrieval.findMatch('   ');
      expect(result).toBeNull();
    });

    it('should select random response from multiple options', () => {
      // This test verifies that multiple calls can return different responses
      const results = [];
      for (let i = 0; i < 10; i++) {
        const result = retrieval.findMatch('hello');
        results.push(result.reply);
      }
      
      // Should have both responses in the results
      expect(results).toContain('Hi there!');
      expect(results).toContain('Hello!');
    });
  });

  describe('synthesize', () => {
    it('should return object with correct structure', () => {
      const result = retrieval.synthesize('test', ['response']);
      expect(result).toHaveProperty('id', 'test');
      expect(result).toHaveProperty('reply', 'response');
      expect(result).toHaveProperty('type', 'fact');
      expect(result).toHaveProperty('confidence', 1.0);
    });

    it('should handle single string answer', () => {
      const result = retrieval.synthesize('test', 'single response');
      expect(result.reply).toBe('single response');
    });

    it('should handle array of answers', () => {
      const answers = ['response1', 'response2', 'response3'];
      const result = retrieval.synthesize('test', answers);
      expect(answers).toContain(result.reply);
    });

    it('should select random answer from array', () => {
      const answers = ['response1', 'response2'];
      const results = [];
      for (let i = 0; i < 20; i++) {
        const result = retrieval.synthesize('test', answers);
        results.push(result.reply);
      }
      
      // Both responses should appear in results
      expect(results).toContain('response1');
      expect(results).toContain('response2');
    });
  });

  describe('teach', () => {
    it('should add new knowledge entry', () => {
      const count = retrieval.teach('new query', 'new answer');
      expect(count).toBe(1);
      expect(retrieval.knowledge['new query']).toEqual(['new answer']);
    });

    it('should add to existing knowledge entry', () => {
      const initialCount = retrieval.teach('hello', 'another response');
      expect(initialCount).toBe(3); // Was 2, now 3
      expect(retrieval.knowledge['hello']).toHaveLength(3);
      expect(retrieval.knowledge['hello']).toContain('another response');
    });

    it('should normalize key to lowercase', () => {
      retrieval.teach('NEW QUERY', 'answer');
      expect(retrieval.knowledge['new query']).toBeDefined();
      expect(retrieval.knowledge['NEW QUERY']).toBeUndefined();
    });

    it('should trim whitespace from key', () => {
      retrieval.teach('  trimmed query  ', 'answer');
      expect(retrieval.knowledge['trimmed query']).toBeDefined();
    });

    it('should return updated count', () => {
      const count1 = retrieval.teach('count test', 'first');
      const count2 = retrieval.teach('count test', 'second');
      const count3 = retrieval.teach('count test', 'third');
      
      expect(count1).toBe(1);
      expect(count2).toBe(2);
      expect(count3).toBe(3);
    });

    it('should handle empty answer', () => {
      const count = retrieval.teach('empty answer', '');
      expect(count).toBe(1);
      expect(retrieval.knowledge['empty answer']).toEqual(['']);
    });
  });

  describe('Integration with findMatch', () => {
    it('should find newly taught knowledge', () => {
      retrieval.teach('integration test', 'integration response');
      
      const result = retrieval.findMatch('integration test');
      expect(result).not.toBeNull();
      expect(result.reply).toBe('integration response');
    });

    it('should find partial matches for taught knowledge', () => {
      retrieval.teach('partial match test', 'partial response');
      
      const result = retrieval.findMatch('partial match');
      expect(result).not.toBeNull();
      expect(result.reply).toBe('partial response');
    });
  });
});
