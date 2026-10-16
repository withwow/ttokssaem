import 'package:dio/dio.dart';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/bloc/findid/bloc.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/reusable/auth_page_layout.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

class FindidPage extends StatefulWidget {
  @override
  _FindidPageState createState() => _FindidPageState();
}

class _FindidPageState extends State<FindidPage> {
  final _globalFunction = GlobalFunction();
  late FindidBloc _findidBloc;
  final CancelToken apiToken = CancelToken();
  String textMemberName = '';
  String textContact = '';

  @override
  void initState() {
    _findidBloc = BlocProvider.of<FindidBloc>(context);
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
      child: BlocListener<FindidBloc, FindidState>(
        listener: (context, state) {
          if (state is FindidError) {
            Navigator.pop(context);
            Fluttertoast.showToast(
                msg: state.errorMessage,
                toastLength: Toast.LENGTH_LONG,
                backgroundColor: Colors.red,
                textColor: Colors.white,
                fontSize: 13);
          }
          if (state is FindidWaiting) {
            FocusScope.of(context).unfocus();
            _globalFunction.showProgressDialog(context);
          }
          if (state is FindidSuccess) {
            Navigator.pop(context);
            if (kDebugMode) print('data findid : ${state.findidData}');
            _globalFunction.showSuccessToast('정상적으로 요청하였습니다');
          }
        },
        child: _form(),
      ),
    );
  }

  Widget _form() => AuthPageLayout(
        title: '아이디 찾기',
        headline: '아이디를 찾아드릴게요',
        description: '가입할 때 등록한 이름과 전화번호를 입력하면\n아이디 안내를 메일로 보내드려요.',
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
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
                onPressed: () => _findidBloc.add(Findid(
                    membername: textMemberName,
                    contact: textContact,
                    apiToken: apiToken)),
                child: const Text('아이디 안내 메일 받기',
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      );
}
