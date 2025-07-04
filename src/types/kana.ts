export enum KanaCategory {
  SEION = 'seion',           
  DAKUON = 'dakuon',         
  HANDAKUON = 'handakuon',   
  YOON = 'yoon'              
}
export enum KanaType {
  HIRAGANA = 'hiragana',     
  KATAKANA = 'katakana'      
}
export interface KanaCharacter {
  id: string;                
  hiragana: string;          
  katakana: string;          
  romaji: string;            
  category: KanaCategory;    
  audioUrl?: string;         
  difficulty: number;        
  strokeCount?: number;      
  mnemonics?: {              
    hiragana?: string;
    katakana?: string;
  };
}
export interface PracticeOption {
  id: string;
  character: KanaCharacter;
  isCorrect: boolean;
}
export interface PracticeQuestion {
  id: string;
  targetCharacter: KanaCharacter;
  options: PracticeOption[];
  questionType: 'recognition' | 'writing';
  displayType: KanaType;
}
