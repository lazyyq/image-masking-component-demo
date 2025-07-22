import { useState } from "react";
import ImageMasking, { type Mask } from "../components/ImageMasking";

export default function Demo() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [masks, setMasks] = useState<Mask[]>([]);
  const [hoveredMaskId, setHoveredMaskId] = useState<string | null>(null);
  const [maskForm, setMaskForm] = useState({
    x: '',
    y: '',
    width: '',
    height: ''
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setMasks([]); // 새 이미지 선택 시 마스크 초기화
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = (src: string) => {
    setSelectedImage(src);
    setMasks([]); // 새 이미지 선택 시 마스크 초기화
  };

  const handleMaskDelete = (maskId: string) => {
    setMasks(prev => prev.filter(mask => mask.id !== maskId));
  };

  const handleFormChange = (field: keyof typeof maskForm, value: string) => {
    setMaskForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMask = () => {
    const x = parseFloat(maskForm.x);
    const y = parseFloat(maskForm.y);
    const width = parseFloat(maskForm.width);
    const height = parseFloat(maskForm.height);

    // 입력값 검증
    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
      alert('모든 필드에 유효한 숫자를 입력해주세요.');
      return;
    }

    if (width <= 0 || height <= 0) {
      alert('너비와 높이는 0보다 커야 합니다.');
      return;
    }

    if (x < 0 || y < 0) {
      alert('X, Y 좌표는 0 이상이어야 합니다.');
      return;
    }

    // 새 마스크 추가
    const newMask: Mask = {
      id: Date.now().toString(),
      x,
      y,
      width,
      height
    };

    setMasks(prev => [...prev, newMask]);
    
    // 폼 초기화
    setMaskForm({ x: '', y: '', width: '', height: '' });
  };

  const sampleImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            이미지 마스킹 데모
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            이미지에 검은 직사각형 마스크를 추가하여 특정 영역을 가릴 수 있습니다. 
            이미지를 업로드하거나 샘플 이미지를 선택해보세요.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 이미지 선택 섹션 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">이미지 선택</h2>
            
            {/* 파일 업로드 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 업로드
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* 샘플 이미지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                또는 샘플 이미지 선택
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleImages.map((src, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === src
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleImageSelect(src)}
                  >
                    <img
                      src={src}
                      alt={`샘플 이미지 ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 마스킹 컴포넌트와 마스크 목록 */}
          {selectedImage && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 이미지 마스킹 */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">이미지 마스킹</h2>
                <p className="text-gray-600 mb-4">
                  이미지를 클릭하고 드래그하여 마스크를 추가하세요. 
                  마스크를 클릭하면 삭제할 수 있습니다.
                </p>
                <ImageMasking 
                  src={selectedImage} 
                  masks={masks}
                  onMasksChange={setMasks}
                  hoveredMaskId={hoveredMaskId}
                />
              </div>

              {/* 마스크 목록 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">마스크 관리</h3>
                
                {/* 좌표 입력으로 마스크 추가 */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">좌표로 마스크 추가</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">X 좌표</label>
                      <input
                        type="number"
                        value={maskForm.x}
                        onChange={(e) => handleFormChange('x', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Y 좌표</label>
                      <input
                        type="number"
                        value={maskForm.y}
                        onChange={(e) => handleFormChange('y', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">너비</label>
                      <input
                        type="number"
                        value={maskForm.width}
                        onChange={(e) => handleFormChange('width', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="100"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">높이</label>
                      <input
                        type="number"
                        value={maskForm.height}
                        onChange={(e) => handleFormChange('height', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="100"
                        min="1"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddMask}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    마스크 추가
                  </button>
                </div>

                <h4 className="font-medium text-gray-900 mb-3">마스크 목록</h4>
                {masks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    아직 마스크가 없습니다.<br />
                    이미지에 마스크를 추가해보세요.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {masks.map((mask, index) => (
                      <div
                        key={mask.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onMouseEnter={() => setHoveredMaskId(mask.id)}
                        onMouseLeave={() => setHoveredMaskId(null)}
                        onClick={() => handleMaskDelete(mask.id)}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            마스크 #{index + 1}
                          </div>
                          <div className="text-sm text-gray-500">
                            위치: ({Math.round(mask.x)}, {Math.round(mask.y)})
                          </div>
                          <div className="text-sm text-gray-500">
                            크기: {Math.round(mask.width)} × {Math.round(mask.height)}
                          </div>
                        </div>
                        <div className="ml-3">
                          <svg 
                            className="w-5 h-5 text-red-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        💡 <strong>팁:</strong> 마스크에 마우스를 올리면 이미지에서 해당 마스크가 강조됩니다. 
                        클릭하면 삭제됩니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedImage && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg text-gray-500">
                위에서 이미지를 선택하면 마스킹 도구가 나타납니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}