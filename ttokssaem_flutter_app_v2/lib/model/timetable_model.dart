/*
 * 수능/평시 시간표 (/api/v1/timetable)
 *  - class 는 studyplan.class 값 (1부터)
 *  - code 는 교시 식별자 (P0~P8, LUNCH, DINNER). 시간표가 다른 날짜 사이에서 교시를 맞출 때 사용
 */
class TimetableSlotModel {
  late int classhour;
  late String code;
  late String label;
  late String shortlabel;
  late String timetext;

  TimetableSlotModel(this.classhour, this.code, this.label, this.shortlabel, this.timetext);

  TimetableSlotModel.fromJson(Map<String, dynamic> json) {
    classhour = json['class'] == null ? 0 : int.parse(json['class'].toString());
    code = json['code'] == null ? '' : json['code'].toString();
    label = json['label'] == null ? '' : json['label'].toString();
    shortlabel = json['shortlabel'] == null ? label : json['shortlabel'].toString();
    timetext = json['timetext'] == null ? '' : json['timetext'].toString();
  }

  Map<String, dynamic> toJson() {
    return {
      'class': classhour,
      'code': code,
      'label': label,
      'shortlabel': shortlabel,
      'timetext': timetext,
    };
  }

  // 입력칸 라벨: "0교시 08:00 ~ 08:30"
  String get fieldLabel => timetext.isEmpty ? label : '$label $timetext';
}

class TimetableModel {
  static const String MODE_NORMAL = 'NORMAL';
  static const String MODE_CSAT = 'CSAT';

  late String plandate;
  late String mode;
  late String title;
  late String startdate;
  late String enddate;
  late List<TimetableSlotModel> slots;

  TimetableModel(this.plandate, this.mode, this.title, this.startdate, this.enddate, this.slots);

  TimetableModel.fromJson(Map<String, dynamic> json) {
    plandate = json['plandate'] == null ? '' : json['plandate'].toString();
    mode = json['mode'] == null ? MODE_NORMAL : json['mode'].toString();
    title = json['title'] == null ? '' : json['title'].toString();
    startdate = json['startdate'] == null ? '' : json['startdate'].toString();
    enddate = json['enddate'] == null ? '' : json['enddate'].toString();
    List responseList = json['slots'] == null ? [] : json['slots'];
    slots = responseList.map((f) => TimetableSlotModel.fromJson(f)).toList();
  }

  Map<String, dynamic> toJson() {
    return {
      'plandate': plandate,
      'mode': mode,
      'title': title,
      'startdate': startdate,
      'enddate': enddate,
      'slots': slots.map((s) => s.toJson()).toList(),
    };
  }

  bool get isCsat => mode == MODE_CSAT;

  TimetableSlotModel? slotOf(int classhour) {
    for (final slot in slots) {
      if (slot.classhour == classhour) return slot;
    }
    return null;
  }

  TimetableSlotModel? slotOfCode(String code) {
    for (final slot in slots) {
      if (slot.code == code) return slot;
    }
    return null;
  }

  // 목록용 짧은 이름 ("점  심"). 시간표에 없는 칸이면 "N번 칸"
  String shortLabelOf(int classhour) {
    final slot = slotOf(classhour);
    if (slot != null) return slot.shortlabel;
    return classhour > 0 ? '$classhour번 칸' : '없  음';
  }

  // 내장 평시 시간표 (서버 응답도 저장값도 없을 때만 사용)
  static TimetableModel normal(String plandate) {
    return TimetableModel(plandate, MODE_NORMAL, '', '', '', [
      TimetableSlotModel(1, 'P1', '1교시', '1교시', '08:00 ~ 09:50'),
      TimetableSlotModel(2, 'P2', '2교시', '2교시', '10:00 ~ 11:50'),
      TimetableSlotModel(3, 'LUNCH', '점심시간', '점  심', '11:50 ~ 12:59'),
      TimetableSlotModel(4, 'P3', '3교시', '3교시', '13:00 ~ 14:50'),
      TimetableSlotModel(5, 'P4', '4교시', '4교시', '15:00 ~ 16:50'),
      TimetableSlotModel(6, 'DINNER', '저녁시간', '저  녁', '16:50 ~ 17:59'),
      TimetableSlotModel(7, 'P5', '5교시', '5교시', '18:00 ~ 19:50'),
      TimetableSlotModel(8, 'P6', '6교시', '6교시', '20:00 ~ 21:50'),
      TimetableSlotModel(9, 'P7', '7교시', '7교시', '22:00 ~ 23:50'),
      TimetableSlotModel(10, 'P8', '8교시', '8교시', '24:00 ~ 01:00'),
    ]);
  }
}
