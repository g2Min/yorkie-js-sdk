import { useEffect, useState, useRef } from 'react';
import yorkie, { Document } from 'yorkie-js-sdk';
import './App.css';
import ChangeBrushColor from './hooks/changeBrushColor'; // ChangeBrushColor 컴포넌트 가져오기

const GRID_SIZE = 16; // 그리드 크기 (16x16 픽셀)
const INITIAL_COLOR = '#ffffff'; // 초기 색상 (흰색)

/**
 * 픽셀 데이터 모델
 */
interface Pixel {
  x: number;
  y: number;
  color: string;
  user?: string;
}

/**
 * `App`은 그리드의 루트 컴포넌트입니다.
 */
const App = () => {
  const [pixels, setPixels] = useState<Pixel[][]>(initializeGrid());
  const [doc, setDoc] = useState<Document<{ pixels: Pixel[][] }> | null>(null);
  const clientRef = useRef<any>(null); // yorkie 클라이언트 참조
  const [brushColor, setBrushColor] = useState<string>('#000000'); // 브러시 색상 상태

  // 그리드를 초기화하는 함수
  function initializeGrid(): Pixel[][] {
    const initialGrid: Pixel[][] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const row: Pixel[] = [];
      for (let y = 0; y < GRID_SIZE; y++) {
        row.push({ x, y, color: INITIAL_COLOR });
      }
      initialGrid.push(row);
    }
    return initialGrid;
  }

  // 픽셀을 클릭하여 색상을 변경하는 함수
  const handlePixelClick = (x: number, y: number) => {
    if (doc) {
      doc.update((root) => {
        root.pixels[x][y].color = brushColor; // 선택된 브러시 색상으로 업데이트
      });
    }
    // 로컬 상태도 업데이트하여 즉시 반영
    setPixels((prevPixels) => {
      const newPixels = [...prevPixels];
      newPixels[x][y] = { ...newPixels[x][y], color: brushColor };
      return newPixels;
    });
  };

  // 브러시 색상을 변경하는 함수
  const changeBrushColor = (color: string) => {
    setBrushColor(color);
  };

  useEffect(() => {
    // Yorkie 클라이언트 및 문서 초기화
    const initializeYorkie = async () => {
      clientRef.current = new yorkie.Client('http://localhost:8080', {
        apiKey: import.meta.env.VITE_YORKIE_API_KEY
      }); // Yorkie 서버 주소
      await clientRef.current.activate();

      const newDoc = new yorkie.Document<{ pixels: Pixel[][] }>('shared-grid');
      await clientRef.current.attach(newDoc);

      // 문서에 픽셀 그리드를 초기화
      newDoc.update((root) => {
        if (!root.pixels) {
          root.pixels = initializeGrid();
        }
      });

      // 문서 변경 사항 구독
      newDoc.subscribe(() => {
        setPixels([...newDoc.getRoot().pixels]);
      });

      // 현재 상태 설정
      setPixels([...newDoc.getRoot().pixels]);
      setDoc(newDoc);
    };

    initializeYorkie();

    // 컴포넌트 언마운트 시 클라이언트 해제
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  return (
    <div className="App">
      {/* ChangeBrushColor 컴포넌트 추가, 브러시 색상 변경 함수를 전달 */}
      <ChangeBrushColor changeBrushColor={changeBrushColor} brushColor={brushColor} />
      <div className="grid" >
        {pixels.map((row, x) =>
          row.map((pixel, y) => (
            <div
              key={`${x}-${y}`}
              className="pixel"
              style={{ backgroundColor: pixel.color }}
              onClick={() => handlePixelClick(x, y)}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
