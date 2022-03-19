# firestore-migration

> 미운정 잔득 든 Firestore 를 벗어나며

## 관리자 콘솔 작업을 위해 Migration

Migration 할 Collection 들

* PointHistory
* CardHistory
* PrintHistory
* PrintJob
* User
* File
* Kiosk

총 6개의 Collection

---

Cloud Functions, PubSub 트리거로 이동시킬 로직

1. create: PrintHistory 이벤트 수신
2. 관련된 데이터 수집
    - CardHistory or PointHistory or both
    - PrintJob (PrintHistory 내부의 정보를 사용한다.)
    - User
    - File
    - Kiosk
3. User, File, Kiosk, PrintJob 는 DB 에 존재 여부 확인
    1. 존재한다면 update
    2. 존재하지 않는다면 create (`isDeleted=True` 로 설정 ⇒ 이후에 실제 마이그레이션 시 삭제되지 않은것이면 업데이트해서 다시 살리면 됨)
    3. 의존관계 상 User → File → Kiosk → PrintJob 순으로 추가(업데이트)
    4. 인쇄 직후 파일이 삭제되었을 가능성이 있음 ⇒ 고려중...
4. CardHistory 와 PointHistory create
5. PrintHistory create