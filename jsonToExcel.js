// Example JSON data
// const data = [
//   {
//     urId: "user1",
//     urNm: "John Doe",
//     soNm: "Org1",
//     slaNm: "Level1",
//     urEmail: "john@example.com",
//     urTel: "+1234567890",
//     urRegDatetime: "2023-01-01T00:00Z",
//     urLoginFailCnt: 0,
//     urIsUse:"Y",
//     staAgreeDatetime:"2023-01-01T00:00Z",
//     urIsLeave:"N"
//   },
//   ... 여기에 추가적인 데이터 항목들이 올 수 있습니다.
// ];

function jsonToExcel(data) {
// 변환할 필드와 새로운 열 이름을 지정
    const columnMapping = {
        'urId': 'ID',
        'urNm': '이름',
        'soNm': '조직',
        'slaNm': '레벨 권한',
        'urEmail': 'E-mail',
        'urTel': '연락처',
        'urRegDatetime': '등록날짜',
        'urLoginFailCnt': '접속제한',
        'urIsUse':'사용여부',
        'staAgreeDatetime':'약관동의여부',
        'urIsLeave':'탈퇴여부'
    };

// 필요한 컬럼만 추출하고 이름 변경
    const transformedData = data.map((row, index) => {
        const newRow = { '#': data.length - index }; // 번호 컬럼 추가(역순)
        for (let key in row) {
            if (columnMapping[key]) {
                newRow[columnMapping[key]] = row[key];
            }
        }
        return newRow;
    });

// 원하는 순서대로 컬럼을 정렬
    const columnOrder = ['#', ...Object.values(columnMapping)];
    const orderedData = transformedData.map(row => {
        let orderedRow = {};
        columnOrder.forEach(key => {
            orderedRow[key] = row[key];
        });
        return orderedRow;
    });

// 오늘 날짜
    let dateObj=new Date();
    let year= dateObj.getFullYear();
    let month= String(dateObj.getMonth()+1).padStart(2,0); // Months are zero based
    let day= String(dateObj.getDate()).padStart(2,0);

    let todayDate= year + month + day;

// 새 워크북 생성
    const wb = XLSX.utils.book_new();

// 변환된 JSON 데이터로부터 워크시트를 생성
    const ws = XLSX.utils.json_to_sheet(orderedData);

// 각 열의 최대 문자 길이를 계산
    ws['!cols'] = columnOrder.map(key => {
        const maxLength = orderedData.reduce((max, row) => {
            return row[key] && row[key].toString().length > max ? row[key].toString().length : max;
        }, 0);

        return { wch: maxLength };
    });

// 워크북에 새 워크시트를 추가(Sheet1은 시트 이름)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

// 파일이름을 "파일이름"+오늘날짜로 설정
    let filename= "파일이름_" + todayDate + ".xlsx";

// 워크북을 파일로 저장
    XLSX.writeFile(wb, filename);
}