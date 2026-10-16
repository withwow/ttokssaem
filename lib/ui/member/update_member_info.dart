import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/bloc/updateMemberInfo/bloc.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/auth_page_layout.dart';

class UpdateMemberInfoPage extends StatefulWidget {
  final String memberName;
  final String contact;
  final String email;

  const UpdateMemberInfoPage(this.memberName, this.contact, this.email);

  @override
  _UpdateMemberInfoPageState createState() => _UpdateMemberInfoPageState();
}

class _UpdateMemberInfoPageState extends State<UpdateMemberInfoPage> {
  final _globalWidget = GlobalWidget();
  final _globalFunction = GlobalFunction();

  bool _obscureText = true;
  IconData _iconVisible = Icons.visibility_off;

  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  late UpdateMemberInfoBloc _updateMemberInfoBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  late TextEditingController memberNameController;
  late TextEditingController contactController;
  late TextEditingController emailController;

  String textMemberPw = '';

  void _toggleObscureText() {
    setState(() {
      _obscureText = !_obscureText;
      if (_obscureText == true) {
        _iconVisible = Icons.visibility_off;
      } else {
        _iconVisible = Icons.visibility;
      }
    });
  }

  @override
  void initState() {
    _updateMemberInfoBloc = BlocProvider.of<UpdateMemberInfoBloc>(context);

    memberNameController = TextEditingController();
    contactController = TextEditingController();
    emailController = TextEditingController();

    memberNameController.text = widget.memberName;
    contactController.text = widget.contact;
    emailController.text = widget.email;

    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () {
          FocusScopeNode currentFocus = FocusScope.of(context);

          if (!currentFocus.hasPrimaryFocus) {
            currentFocus.unfocus();
            // 화면 로테이션이 가능한 풀스크린 앱
            SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
          }
        },
        child: MultiBlocListener(listeners: [
          BlocListener<UpdateMemberInfoBloc, UpdateMemberInfoState>(
              listener: (context, state) {
            if (state is UpdateMemberInfoError) {
              Navigator.pop(context);
              Fluttertoast.showToast(
                  msg: state.errorMessage,
                  toastLength: Toast.LENGTH_LONG,
                  backgroundColor: Colors.red,
                  textColor: Colors.white,
                  fontSize: 13);
            }
            if (state is UpdateMemberInfoWaiting) {
              FocusScope.of(context).unfocus();
              _globalFunction.showProgressDialog(context);
            }
            if (state is UpdateMemberInfoSuccess) {
              Navigator.pop(context);

              if (kDebugMode) {
                print('data UpdateMemberInfo : ${state.updateMemberInfoData}');
              }
              _globalFunction.showSuccessToast('정상적으로 요청하였습니다');
            }
          }),
        ], child: EditForm()));
  }

  EditForm() {
    return AuthPageLayout(
      title: '정보 변경',
      headline: '내 정보를 최신으로 유지하세요',
      description: '본인 확인을 위해 현재 비밀번호를 입력한 후\n수정할 정보를 저장해 주세요.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            obscureText: _obscureText,
            style: TextStyle(color: _textColor),
            cursorColor: _cursorColor,
            decoration: InputDecoration(
              focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: _borderColor, width: 2.0)),
              enabledBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: _underlineColor),
              ),
              labelText: '현재 비밀번호',
              labelStyle: TextStyle(color: _labeltextColor),
              suffixIcon: IconButton(
                  icon: Icon(_iconVisible, color: BLACK55, size: 20),
                  onPressed: () {
                    _toggleObscureText();
                  }),
            ),
            onChanged: (text) {
              setState(() {
                textMemberPw = text;
              });
            },
          ),
          SizedBox(
            height: 24,
          ),
          TextField(
            keyboardType: TextInputType.text,
            style: TextStyle(color: _textColor),
            cursorColor: _cursorColor,
            controller: memberNameController,
            decoration: InputDecoration(
                focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: _borderColor, width: 2.0)),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: _underlineColor),
                ),
                labelText: '이름',
                labelStyle: TextStyle(color: _labeltextColor)),
            onChanged: (text) {
              setState(() {});
            },
          ),
          SizedBox(
            height: 24,
          ),
          TextField(
            keyboardType: TextInputType.number,
            style: TextStyle(color: _textColor),
            cursorColor: _cursorColor,
            controller: contactController,
            decoration: InputDecoration(
                focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: _borderColor, width: 2.0)),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: _underlineColor),
                ),
                labelText: '전화번호',
                labelStyle: TextStyle(color: _labeltextColor)),
            onChanged: (text) {
              setState(() {});
            },
          ),
          SizedBox(
            height: 24,
          ),
          TextField(
            keyboardType: TextInputType.emailAddress,
            style: TextStyle(color: _textColor),
            cursorColor: _cursorColor,
            controller: emailController,
            decoration: InputDecoration(
                focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: _borderColor, width: 2.0)),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: _underlineColor),
                ),
                labelText: '이메일',
                labelStyle: TextStyle(color: _labeltextColor)),
            onChanged: (text) {
              setState(() {});
            },
          ),
          SizedBox(
            height: 24,
          ),
          CupertinoButton(
            child: Text(
              '정보 변경',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: BUTTON_TEXT_COLOR),
              textAlign: TextAlign.center,
            ),
            color: BUTTON_COLOR,
            disabledColor: BUTTON_DISABLED_COLOR,
            onPressed: () {
              String _memberpw = textMemberPw;
              String _membername = memberNameController.text.toString();
              String _email = emailController.text.toString();
              String _contact = contactController.text.toString();

              if (textMemberPw.isEmpty) {
                _globalFunction.showFailedToast('비밀번호를 입력하여 주세요.');
                return;
              }

              _updateMemberInfoBloc.add(UpdateMemberInfo(
                  memberpw: _memberpw,
                  membername: _membername,
                  contact: _contact,
                  email: _email,
                  apiToken: apiToken));
            },
          ),
        ],
      ),
    );
  }
}
