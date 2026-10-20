import 'package:dio/dio.dart';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/bloc/requestm2m/bloc.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/reusable/auth_page_layout.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

class RequestM2MPage extends StatefulWidget {
  @override
  _RequestM2MPageState createState() => _RequestM2MPageState();
}

class _RequestM2MPageState extends State<RequestM2MPage> {
  final _globalFunction = GlobalFunction();
  late RequestM2MBloc _requestM2MBloc;
  final CancelToken apiToken = CancelToken();
  late TextEditingController questionController;

  @override
  void initState() {
    _requestM2MBloc = BlocProvider.of<RequestM2MBloc>(context);
    questionController = TextEditingController();
    super.initState();
  }

  @override
  void dispose() {
    questionController.dispose();
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
      child: BlocListener<RequestM2MBloc, RequestM2MState>(
        listener: (context, state) {
          if (state is RequestM2MError) {
            Navigator.pop(context);
            Fluttertoast.showToast(
                msg: state.errorMessage,
                toastLength: Toast.LENGTH_LONG,
                backgroundColor: Colors.red,
                textColor: Colors.white,
                fontSize: 13);
          }
          if (state is RequestM2MWaiting) {
            FocusScope.of(context).unfocus();
            _globalFunction.showProgressDialog(context);
          }
          if (state is RequestM2MSuccess) {
            Navigator.pop(context);
            if (kDebugMode) print('data RequestM2M : ${state.requestM2MData}');
            _globalFunction.showSuccessToast('정상적으로 요청하였습니다');
          }
        },
        child: _form(),
      ),
    );
  }

  Widget _form() => AuthPageLayout(
        title: '1:1 문의하기',
        headline: '무엇을 도와드릴까요?',
        description: '출결과 간단한 문의를 남겨주시면\n근무 중인 선생님이 확인 후 답변해 드려요.',
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextFormField(
              controller: questionController,
              minLines: 5,
              maxLines: 7,
              maxLength: 100,
              keyboardType: TextInputType.multiline,
              textInputAction: TextInputAction.newline,
              style: const TextStyle(color: BLACK21),
              cursorColor: TTOK_GREEN,
              decoration: authInputDecoration(
                label: '문의 내용',
                icon: Icons.chat_bubble_outline,
                hintText: '문의하실 내용을 입력해 주세요.',
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 54,
              child: ElevatedButton(
                style: authPrimaryButtonStyle(),
                onPressed: _submit,
                child: const Text('문의사항 등록',
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      );

  void _submit() {
    final message = questionController.text.trim();
    if (message.isEmpty) {
      Fluttertoast.showToast(
          msg: '내용이 비었습니다.',
          toastLength: Toast.LENGTH_SHORT,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 13);
      return;
    }
    _requestM2MBloc.add(RequestM2M(message: message, apiToken: apiToken));
  }
}
