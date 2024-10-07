import { useRef } from 'react';
import { DottingRef, useBrush } from 'dotting';

// ChangeBrushColor 컴포넌트에 전달될 props의 타입 정의
interface ChangeBrushColorProps {
  changeBrushColor: (color: string) => void;
  brushColor: string;
}

const ChangeBrushColor: React.FC<ChangeBrushColorProps> = ({ changeBrushColor, brushColor }) => {
  const ref = useRef<DottingRef>(null);
  useBrush(ref); // ref를 사용하여 Dotting의 브러시 기능 활용

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 50,
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 20,
          backgroundColor: 'white',
        }}
      >
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 3,
        }}
      >
        <span style={{ fontSize: 13, color: 'black' }}>Brush Color:</span>
        <div
          style={{
            borderRadius: '50%',
            width: 20,
            height: 20,
            marginLeft: 15,
            backgroundColor: brushColor,
          }}
        ></div>
      </div>
      <div>
        {[
          '#FF0000',
          '#0000FF',
          '#00FF00',
          '#FF00FF',
          '#00FFFF',
          '#FFFF00',
          '#000000',
          '#FFFFFF',
        ].map((color) => (
          <div
            key={color}
            onClick={() => changeBrushColor(color)} // 클릭 시 브러시 색상 변경
            style={{
              width: 25,
              height: 25,
              margin: 10,
              border: '1px solid black',
              backgroundColor: color,
              display: 'inline-block',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChangeBrushColor;
