# 피드백 요청 API 400 에러 버그 수정

## 문제 상황
스윙/스켈핑/데이 트레이딩 피드백 요청 API를 호출 시 400 Bad Request 에러 발생

## 원인 분석

### 1. feedbackAPI.ts의 중복 FormData 변환 문제
**위치**: `app/lib/api/feedbackAPI.ts:11-34`

**문제**:
- mapper에서 이미 생성된 FormData 객체를 받아서 다시 FormData로 변환하려고 시도
- `Object.entries(data)`로 FormData를 순회하면서 새로운 FormData를 만들려 했으나, 이는 FormData의 구조를 파괴함

```typescript
// 수정 전 (잘못된 코드)
requestSwingFeedback(data: SwingFeedbackRequest): Promise<ApiResponse> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value as any));
  return fetcher("/api/v1/feedback-requests/swing", { method: "POST", body: formData });
}
```

**해결**:
- 이미 FormData 객체이므로 그대로 전달

```typescript
// 수정 후 (올바른 코드)
requestSwingFeedback(data: SwingFeedbackRequest): Promise<ApiResponse> {
  // data는 이미 FormData 객체이므로 그대로 전달
  return fetcher("/api/v1/feedback-requests/swing", { method: "POST", body: data });
}
```

### 2. feedbackFormMapper.ts의 잘못된 필드 매핑

#### 2.1 스윙(Swing) 매핑 오류
**위치**: `app/utils/feedbackFormMapper.ts:10-20`

**문제 1**: feedbackYear, feedbackMonth, feedbackWeek에 잘못된 값 할당
```typescript
// 수정 전
fd.append("feedbackYear", formData.membershipLevel || 2025);  // 잘못됨!
fd.append("feedbackMonth", formData.membershipLevel || 10);   // 잘못됨!
fd.append("feedbackWeek", formData.membershipLevel || 2);     // 잘못됨!
```

```typescript
// 수정 후
fd.append("feedbackYear", String(formData.feedbackYear || 2025));
fd.append("feedbackMonth", String(formData.feedbackMonth || 10));
fd.append("feedbackWeek", String(formData.feedbackWeek || 2));
```

**문제 2**: leverage 필드에 잘못된 소스 필드 사용
```typescript
// 수정 전
fd.append("leverage", String(formData.risk || 0));  // risk 사용 (잘못됨!)
```

```typescript
// 수정 후
fd.append("leverage", String(formData.leverage || 0));  // leverage 사용
```

#### 2.2 스켈핑(Scalping) 매핑 오류
**위치**: `app/utils/feedbackFormMapper.ts:108-145`

**문제**: API 스펙에 따르면 스켈핑 요청에 필수인 필드들이 누락됨
- API 스펙상 필수 필드: `position`, `pnl`, `rnr`, `entryPrice`, `exitPrice`, `settingStopLoss`, `settingTakeProfit`, `positionStartReason`, `positionEndReason`
- 기존 코드에는 이러한 필수 필드들이 없었음

**해결**: API 스펙에 맞춰 모든 필수 필드 추가
```typescript
// 필수 필드 추가
fd.append("position", formData.position || "LONG");
fd.append("pnl", String(formData.pl || 0));
fd.append("rnr", String(formData.rnr || 0));
fd.append("operatingFundsRatio", String(formData.operatingFundsRatio || 0));
fd.append("entryPrice", String(formData.entryPrice || 0));
fd.append("exitPrice", String(formData.exitPrice || 0));
fd.append("settingStopLoss", String(formData.settingStopLoss || 0));
fd.append("settingTakeProfit", String(formData.settingTakeProfit || 0));
fd.append("positionStartReason", formData.positionStartReason || "string");
fd.append("positionEndReason", formData.positionEndReason || "string");
```

#### 2.3 Free/Basic 폼 매핑 오류
**위치**: `app/utils/feedbackFormMapper.ts:152`

**문제**: leverage 필드에 riskTaking 값 할당
```typescript
// 수정 전
fd.append("leverage", String(formData.riskTaking || 0));  // 잘못됨!
```

```typescript
// 수정 후
fd.append("leverage", String(formData.leverage || 0));
```

### 3. 타입 변환 일관성 문제

**문제**: 숫자 필드들이 일부는 String()으로 변환되고 일부는 그대로 전달됨
- FormData는 모든 값을 문자열로 저장하므로, 명시적으로 String() 변환 필요

**수정 대상 필드들**:
- `operatingFundsRatio`
- `entryPrice`
- `exitPrice`
- `settingStopLoss`
- `settingTakeProfit`

모든 숫자 필드에 `String()` 변환 적용

## 수정 파일 목록

1. `app/lib/api/feedbackAPI.ts`
   - requestSwingFeedback 함수 수정
   - requestDayFeedback 함수 수정
   - requestScalpingFeedback 함수 수정

2. `app/utils/feedbackFormMapper.ts`
   - mapSwingFormData 함수 수정
   - mapScalpingFormData 함수 전면 재작성
   - mapFreeFormData 함수 수정
   - 모든 숫자 필드 String() 변환 추가

## API 스펙 준수 확인

### Swing API 필수 필드
- ✅ courseStatus, membershipLevel
- ✅ feedbackYear, feedbackMonth, feedbackWeek, feedbackRequestDate
- ✅ category, position, riskTaking, leverage
- ✅ pnl, rnr

### Day API 필수 필드
- ✅ courseStatus, membershipLevel
- ✅ feedbackRequestDate
- ✅ category, position, riskTaking, leverage
- ✅ pnl, rnr

### Scalping API 필수 필드
- ✅ courseStatus, membershipLevel, feedbackRequestDate
- ✅ category, position, riskTaking, leverage
- ✅ pnl, rnr
- ✅ operatingFundsRatio (항상 필수)
- ✅ entryPrice, exitPrice (항상 필수)
- ✅ settingStopLoss, settingTakeProfit (항상 필수)
- ✅ positionStartReason, positionEndReason (항상 필수)

## 검증 방법

1. 각 트레이딩 타입(스윙/데이/스켈핑) 피드백 요청 테스트
2. BASIC/PREMIUM 레벨별 테스트
3. 완강 전(BEFORE_COMPLETION)/완강 후(AFTER_COMPLETION) 상태별 테스트
4. 브라우저 개발자도구 Network 탭에서 요청 페이로드 확인
5. 서버 응답 200 OK 확인

## 참고사항

- API 명세는 `api-docs.json`에 정의되어 있음
- API 분석은 `analyze_api_docs.py`를 통해 수행
- FormData는 multipart/form-data 형식으로 전송됨
- 모든 파일 필드(screenshotFiles)는 File 객체로 추가되어야 함
