import 'package:dio/dio.dart';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/bloc/findpw/bloc.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/reusable/auth_page_layout.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

class FindpwPage extends StatefulWidget {
  @override
  _FindpwPageState createState() => _FindpwPageState();
}

class _FindpwPageState extends State<FindpwPage> {
  final _globalFunction = GlobalFunction();
  late FindpwBloc _findpwBloc;
  final CancelToken apiToken = CancelToken();
  String textMemberId = '';
  String textMemberName = '';
  String textContact = '';

  @override
  void initState() {
    _findpwBloc = BlocProvider.of<FindpwBloc>(context);
    super.initState();
  }

  @override
  void dispose() {
    apiToken.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        final currentFocus = FocusScope.of(context);
        if (!currentFocus.hasPrimaryFocus) {
          currentFocus.unfocus();
          SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
        }
      },
      child: BlocListener<FindpwBloc, FindpwState>(
        listener: (context, state) {
          if (state is FindpwError) {
            Navigator.pop(context);
            Fluttertoast.showToast(
                msg: state.errorMessage,
                toastLength: Toast.LENGTH_LONG,
                backgroundColor: Colors.red,
                textColor: Colors.white,
                fontSize: 13);
          }
          if (state is FindpwWaiting) {
            FocusScope.of(context).unfocus();
            _globalFunction.showProgressDialog(context);
          }
          if (state is FindpwSuccess) {
            Navigator.pop(context);
            if (kDebugMode) print('data findpw : ${state.findpwData}');
            _globalFunction.showSuccessToast('정상적으로 요청하였습니다');
          }
        },
        child: _form(),
      ),
    );
  }

  Widget _form() => AuthPageLayout(
        title: '비밀번호 찾기',
        headline: '비밀번호를 재설정하세요',
        description: '가입할 때 입력한 정보를 확인한 뒤\n비밀번호 재설정 안내를 메일로 보내드려요.',
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
                keyboardType: TextInputType.text,
                textInputAction: TextInputAction.next,
                style: const TextStyle(color: BLACK21),
                cursorColor: TTOK_GREEN,
                decoration: authInputDecoration(
                    label: '아이디', icon: Icons.person_outline),
                onChanged: (text) => textMemberId = text),
            const SizedBox(height: 14),
            TextField(
                keyboardType: TextInputType.text,
                textInputAction: TextInputAction.next,
                style: const TextStyle(color: BLACK21),
                cursorColor: TTOK_GREEN,
                decoration: authInputDecoration(
                    label: '이름', icon: Icons.badge_outlined),
                onChanged: (text) => textMemberName = text),
            const SizedBox(height: 14),
            TextField(
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.done,
                style: const TextStyle(color: BLACK21),
                cursorColor: TTOK_GREEN,
                decoration: authInputDecoration(
                    label: '전화번호', icon: Icons.phone_outlined),
                onChanged: (text) => textContact = text),
            const SizedBox(height: 24),
            SizedBox(
              height: 54,
              child: ElevatedButton(
                style: authPrimaryButtonStyle(),
                onPressed: () => _findpwBloc.add(Findpw(
                    memberid: textMemberId,
                    membername: textMemberName,
                    contact: textContact,
                    apiToken: apiToken)),
                child: const Text('재설정 안내 메일 받기',
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      );
}
