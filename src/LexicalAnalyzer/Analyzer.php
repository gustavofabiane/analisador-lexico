<?php

namespace LexicalAnalyzer;

/**
 * Description of Analyzer
 *
 * @author gusta
 */
class Analyzer {

    /**
     *
     * @const array
     */
    const OPTIONS = [];

    /**
     *
     * @var FiniteAutomaton
     */
    private $automaton;

    /**
     * 
     * @param array $options
     */
    public function __construct(array $options = []) {

        $options = array_merge(self::OPTIONS, $options);
            
        $this->automaton = isset($options["automaton"]) ?
                $options["automaton"] : new FiniteAutomaton(
                isset($options["alphabet"]) ? $options["alphabet"] : range('a', 'z'), 
                isset($options["dictionary"]) ? $options["dictionary"] : new Dictionary()
        );
    }
        
    /**
     * 
     * @param SlimSession\Helper $storage
     */
    public function saveState($storage) {

        $storage->set('last_state', $this->automaton->lastState);
        $storage->set('actual_state', $this->automaton->actualState);
        $storage->set('actual_simbol', $this->automaton->actualSimbol);
        $storage->set("dictionary", $this->automaton->dictionary->toArray());
        $storage->set("alphabet", $this->automaton->alphabet);
    }

    /**
     * 
     * @param \LexicalAnalyzer\Token $token
     * @throws \InvalidArgumentException
     */
    public function addWord(Token $token) {

        if (empty($token->__toString())) {

            throw new \InvalidArgumentException("Analyzer::addWord(Token) expects a "
            . "non empty Token, empty passed.", 500);
        }

        $this->automaton->dictionary->add($token->__toString());

        $this->automaton->build();
    }
    
    public function removeWord(Token $token) {
        
        if (empty($token->__toString())) {

            throw new \InvalidArgumentException("Analyzer::removeWord(Token) expects a "
            . "non empty Token, empty passed.", 500);
        }
        
        $this->automaton->dictionary->remove($token->__toString());
        
        $this->automaton->build();
    }

    /**
     * 
     * @param \LexicalAnalyzer\Tokenizer $tokenizer
     * @param bool $backtracking
     * @retrun array
     */
    public function readInput(Tokenizer $tokenizer): array {

        $read = [];
        
        if($tokenizer->isEmpty()) {
            
            $this->automaton->restart();

            $reset = new \stdClass;
            $reset->word = '...';
            $reset->valid = null;
            return [$reset];
        }
        
        $token = $tokenizer->first();
        
        do {

            $this->automaton->restart();

            $validation = $this->automaton->wordIsValid($token);
            
            $read[] = $validation;
            
        } while ($token = $tokenizer->next());
        
        return $read;
    }

    /**
     * 
     * @return \LexicalAnalyzer\FiniteAutomaton
     */
    public function getAutomaton(): FiniteAutomaton {
        
        return $this->automaton;
    }

}
