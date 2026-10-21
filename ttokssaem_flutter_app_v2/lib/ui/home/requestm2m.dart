import 'package:dio/dio.dart';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/bloc/requestm2m/bloc.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/reusable/auth_page_layout.dart';

class RequestM2MPage extends StatefulWidget {
  @override
  _RequestM2MPageState createState() => _RequestM2MPageState();
}

class _RequestM2MPageState extends State<RequestM2MPage> {
  late RequestM2MBloc _requestM2MBloc;
  final CancelToken apiToken = CancelToken();
  late TextEditingController questionController;
  bool _isSubmitting = false;
  bool _isCompleted = false;

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
    return PopScope(
      canPop: !_isSubmitting && !_isCompleted,
      child: GestureDetector(
        onTap: _dismissKeyboard,
        child: BlocListener<RequestM2MBloc, RequestM2MState>(
          listener: (context, state) {
            if (state is RequestM2MWaiting) {
              _dismissKeyboard();
              setState(() => _isSubmitting = true);
            }
            if (state is RequestM2MError) {
              setState(() => _isSubmitting = false);
              Fluttertoast.showToast(
                  msg: state.errorMessage,
                  toastLength: Toast.LENGTH_LONG,
                  backgroundColor: Colors.red,
                  textColor: Colors.white,
                  fontSize: 13);
            }
            if (state is RequestM2MSuccess) {
              _dismissKeyboard();
              if (kDebugMode) {
                print('data RequestM2M : ${state.requestM2MData}');
              }
              setState(() {
                _isSubmitting = false;
                _isCompleted = true;
              });
            }
          },
          child: _isCompleted ? _completion() : _form(),
        ),
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
                onPressed: _isSubmitting ? null : _submit,
                child: _isSubmitting
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          color: Colors.white,
                        ),
                      )
                    : const Text('문의사항 등록',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      );

  void _submit() {
    if (_isSubmitting) return;

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

  void _dismissKeyboard() {
    final currentFocus = FocusScope.of(context);
    if (!currentFocus.hasPrimaryFocus) {
      currentFocus.unfocus();
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
    }
  }

  Widget _completion() {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F5),
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: TTOK_GREEN,
        elevation: 0,
        foregroundColor: Colors.white,
        centerTitle: true,
        title: const Text('1:1 문의하기',
            style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 28, 24, 36),
          child: Column(
            children: [
              Expanded(
                child: Center(
                  child: Container(
                    width: double.infinity,
                    constraints: const BoxConstraints(maxWidth: 480),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 40),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x14000000),
                          blurRadius: 20,
                          offset: Offset(0, 8),
                        ),
                      ],
                    ),
                    child: const Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CircleAvatar(
                          radius: 38,
                          backgroundColor: Color(0x1F1C6C53),
                          child: Icon(Icons.check_rounded,
                              size: 48, color: TTOK_GREEN),
                        ),
                        SizedBox(height: 24),
                        Text(
                          '문의가 등록되었습니다',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: BLACK21,
                            fontSize: 23,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        SizedBox(height: 12),
                        Text(
                          '담당 선생님이 확인 후 답변해 드릴게요.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: BLACK77, fontSize: 15),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  style: authPrimaryButtonStyle(),
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('확인',
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
