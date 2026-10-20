import 'package:flutter/material.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';

class AuthPageLayout extends StatelessWidget {
  const AuthPageLayout({
    super.key,
    required this.title,
    required this.headline,
    required this.description,
    required this.child,
  });

  final String title;
  final String headline;
  final String description;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F5),
      appBar: AppBar(
        backgroundColor: TTOK_GREEN,
        elevation: 0,
        foregroundColor: Colors.white,
        centerTitle: true,
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: SafeArea(
        top: false,
        child: LayoutBuilder(
          builder: (context, constraints) => SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(24, 28, 24, 36),
            child: Center(
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: constraints.maxHeight - 64,
                  maxWidth: 480,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      headline,
                      style: const TextStyle(
                        color: BLACK21,
                        fontSize: 25,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      description,
                      style: const TextStyle(
                          color: BLACK77, fontSize: 14, height: 1.5),
                    ),
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(20),
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
                      child: child,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

InputDecoration authInputDecoration({
  required String label,
  required IconData icon,
  Widget? suffixIcon,
  String? hintText,
}) {
  return InputDecoration(
    labelText: label,
    hintText: hintText,
    labelStyle: const TextStyle(color: BLACK77),
    hintStyle: const TextStyle(color: SOFT_GRAY),
    prefixIcon: Icon(icon, color: TTOK_GREEN, size: 21),
    suffixIcon: suffixIcon,
    filled: true,
    fillColor: const Color(0xFFF6F8F7),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 17),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: TTOK_GREEN, width: 1.5),
    ),
  );
}

ButtonStyle authPrimaryButtonStyle() {
  return ElevatedButton.styleFrom(
    backgroundColor: BUTTON_COLOR,
    foregroundColor: Colors.white,
    elevation: 0,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
  );
}
