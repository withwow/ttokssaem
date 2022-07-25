
namespace TtokFingerPrint
{
    partial class MainForm
    {
        /// <summary>
        /// 필수 디자이너 변수입니다.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 사용 중인 모든 리소스를 정리합니다.
        /// </summary>
        /// <param name="disposing">관리되는 리소스를 삭제해야 하면 true이고, 그렇지 않으면 false입니다.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form 디자이너에서 생성한 코드

        /// <summary>
        /// 디자이너 지원에 필요한 메서드입니다. 
        /// 이 메서드의 내용을 코드 편집기로 수정하지 마세요.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            this.btnSetting = new System.Windows.Forms.Button();
            this.btnEnroll = new System.Windows.Forms.Button();
            this.lblStudentName = new System.Windows.Forms.Label();
            this.lblEnterance = new System.Windows.Forms.Label();
            this.pbFingerPrintStandby = new System.Windows.Forms.PictureBox();
            this.pbLogo = new System.Windows.Forms.PictureBox();
            this.btnClose = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.pbFingerPrintStandby)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbLogo)).BeginInit();
            this.SuspendLayout();
            // 
            // btnSetting
            // 
            this.btnSetting.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(16)))), ((int)(((byte)(62)))), ((int)(((byte)(48)))));
            this.btnSetting.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btnSetting.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnSetting.Font = new System.Drawing.Font("굴림", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.btnSetting.ForeColor = System.Drawing.Color.ForestGreen;
            this.btnSetting.Location = new System.Drawing.Point(111, 252);
            this.btnSetting.Name = "btnSetting";
            this.btnSetting.Size = new System.Drawing.Size(156, 44);
            this.btnSetting.TabIndex = 5;
            this.btnSetting.TabStop = false;
            this.btnSetting.Text = "설정";
            this.btnSetting.UseVisualStyleBackColor = false;
            this.btnSetting.Visible = false;
            this.btnSetting.Click += new System.EventHandler(this.btnSetting_Click);
            // 
            // btnEnroll
            // 
            this.btnEnroll.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(16)))), ((int)(((byte)(62)))), ((int)(((byte)(48)))));
            this.btnEnroll.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btnEnroll.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEnroll.Font = new System.Drawing.Font("굴림", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.btnEnroll.ForeColor = System.Drawing.Color.ForestGreen;
            this.btnEnroll.Location = new System.Drawing.Point(111, 313);
            this.btnEnroll.Name = "btnEnroll";
            this.btnEnroll.Size = new System.Drawing.Size(156, 44);
            this.btnEnroll.TabIndex = 6;
            this.btnEnroll.TabStop = false;
            this.btnEnroll.Text = "지문등록";
            this.btnEnroll.UseVisualStyleBackColor = false;
            this.btnEnroll.Visible = false;
            this.btnEnroll.Click += new System.EventHandler(this.btnEnroll_Click);
            // 
            // lblStudentName
            // 
            this.lblStudentName.Font = new System.Drawing.Font("맑은 고딕", 99.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.lblStudentName.Location = new System.Drawing.Point(273, 252);
            this.lblStudentName.Name = "lblStudentName";
            this.lblStudentName.Size = new System.Drawing.Size(700, 203);
            this.lblStudentName.TabIndex = 7;
            this.lblStudentName.Text = "OOO";
            this.lblStudentName.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lblEnterance
            // 
            this.lblEnterance.Font = new System.Drawing.Font("맑은 고딕", 99.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.lblEnterance.ForeColor = System.Drawing.Color.Gold;
            this.lblEnterance.Location = new System.Drawing.Point(271, 509);
            this.lblEnterance.Name = "lblEnterance";
            this.lblEnterance.Size = new System.Drawing.Size(702, 194);
            this.lblEnterance.TabIndex = 8;
            this.lblEnterance.Text = "OOO";
            this.lblEnterance.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // pbFingerPrintStandby
            // 
            this.pbFingerPrintStandby.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(16)))), ((int)(((byte)(62)))), ((int)(((byte)(48)))));
            this.pbFingerPrintStandby.BackgroundImage = global::TtokFingerPrint.Properties.Resources.fingerprint_standby5;
            this.pbFingerPrintStandby.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.pbFingerPrintStandby.Location = new System.Drawing.Point(360, 203);
            this.pbFingerPrintStandby.Name = "pbFingerPrintStandby";
            this.pbFingerPrintStandby.Size = new System.Drawing.Size(500, 500);
            this.pbFingerPrintStandby.TabIndex = 4;
            this.pbFingerPrintStandby.TabStop = false;
            // 
            // pbLogo
            // 
            this.pbLogo.BackgroundImage = global::TtokFingerPrint.Properties.Resources.logo_banner_trans_450;
            this.pbLogo.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Center;
            this.pbLogo.Location = new System.Drawing.Point(331, 25);
            this.pbLogo.Name = "pbLogo";
            this.pbLogo.Size = new System.Drawing.Size(571, 130);
            this.pbLogo.TabIndex = 2;
            this.pbLogo.TabStop = false;
            // 
            // btnClose
            // 
            this.btnClose.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(16)))), ((int)(((byte)(62)))), ((int)(((byte)(48)))));
            this.btnClose.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btnClose.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnClose.Font = new System.Drawing.Font("굴림", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.btnClose.ForeColor = System.Drawing.Color.ForestGreen;
            this.btnClose.Location = new System.Drawing.Point(12, 12);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(156, 44);
            this.btnClose.TabIndex = 9;
            this.btnClose.TabStop = false;
            this.btnClose.Text = "종료";
            this.btnClose.UseVisualStyleBackColor = false;
            this.btnClose.Visible = false;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(16)))), ((int)(((byte)(62)))), ((int)(((byte)(48)))));
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.ClientSize = new System.Drawing.Size(1300, 894);
            this.Controls.Add(this.btnClose);
            this.Controls.Add(this.lblEnterance);
            this.Controls.Add(this.lblStudentName);
            this.Controls.Add(this.btnEnroll);
            this.Controls.Add(this.btnSetting);
            this.Controls.Add(this.pbFingerPrintStandby);
            this.Controls.Add(this.pbLogo);
            this.DoubleBuffered = true;
            this.Font = new System.Drawing.Font("굴림", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.ForeColor = System.Drawing.SystemColors.ControlLightLight;
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "MainForm";
            this.Text = "똑소리나는쌤 관리형 독서실 출입관리 프로그램";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.MainForm_FormClosing);
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pbFingerPrintStandby)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbLogo)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.PictureBox pbLogo;
        private System.Windows.Forms.PictureBox pbFingerPrintStandby;
        private System.Windows.Forms.Button btnSetting;
        private System.Windows.Forms.Button btnEnroll;
        private System.Windows.Forms.Label lblStudentName;
        private System.Windows.Forms.Label lblEnterance;
        private System.Windows.Forms.Button btnClose;
    }
}

