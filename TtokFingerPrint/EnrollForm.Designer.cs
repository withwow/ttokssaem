
namespace TtokFingerPrint
{
    partial class EnrollForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(EnrollForm));
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.btnEnroll = new System.Windows.Forms.Button();
            this.txtUserID = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.pgbUser = new System.Windows.Forms.ProgressBar();
            this.btnLoadDB = new System.Windows.Forms.Button();
            this.btnSaveDB = new System.Windows.Forms.Button();
            this.btnDeleteData = new System.Windows.Forms.Button();
            this.btnClearDB = new System.Windows.Forms.Button();
            this.lblTotalCount = new System.Windows.Forms.Label();
            this.lsvUser = new System.Windows.Forms.ListView();
            this.columnHeader1 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader2 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader3 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lblStatus = new System.Windows.Forms.Label();
            this.btnOK = new System.Windows.Forms.Button();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.lsvResult = new System.Windows.Forms.ListView();
            this.columnHeader4 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader5 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader6 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.lblIdentifyStatus = new System.Windows.Forms.Label();
            this.btnStop = new System.Windows.Forms.Button();
            this.pgbIdentify = new System.Windows.Forms.ProgressBar();
            this.lblIdentifyTime = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.btnIdentify = new System.Windows.Forms.Button();
            this.txtMemberName = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.btnQurey = new System.Windows.Forms.Button();
            this.lblSchoolName = new System.Windows.Forms.Label();
            this.lblGrade = new System.Windows.Forms.Label();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox3.SuspendLayout();
            this.groupBox4.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.lblGrade);
            this.groupBox1.Controls.Add(this.lblSchoolName);
            this.groupBox1.Controls.Add(this.btnQurey);
            this.groupBox1.Controls.Add(this.txtMemberName);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.btnEnroll);
            this.groupBox1.Controls.Add(this.txtUserID);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Location = new System.Drawing.Point(12, 12);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(424, 155);
            this.groupBox1.TabIndex = 1;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "1) Enrollment";
            // 
            // btnEnroll
            // 
            this.btnEnroll.Location = new System.Drawing.Point(228, 113);
            this.btnEnroll.Name = "btnEnroll";
            this.btnEnroll.Size = new System.Drawing.Size(167, 23);
            this.btnEnroll.TabIndex = 2;
            this.btnEnroll.Text = "Enroll fingerprint to DB";
            this.btnEnroll.UseVisualStyleBackColor = true;
            this.btnEnroll.Click += new System.EventHandler(this.btnEnroll_Click);
            // 
            // txtUserID
            // 
            this.txtUserID.Location = new System.Drawing.Point(79, 113);
            this.txtUserID.Name = "txtUserID";
            this.txtUserID.Size = new System.Drawing.Size(122, 21);
            this.txtUserID.TabIndex = 1;
            this.txtUserID.Text = "1";
            this.txtUserID.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(22, 119);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(53, 12);
            this.label1.TabIndex = 0;
            this.label1.Text = "User NO";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.pgbUser);
            this.groupBox2.Controls.Add(this.btnLoadDB);
            this.groupBox2.Controls.Add(this.btnSaveDB);
            this.groupBox2.Controls.Add(this.btnDeleteData);
            this.groupBox2.Controls.Add(this.btnClearDB);
            this.groupBox2.Controls.Add(this.lblTotalCount);
            this.groupBox2.Controls.Add(this.lsvUser);
            this.groupBox2.Location = new System.Drawing.Point(15, 195);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(424, 297);
            this.groupBox2.TabIndex = 2;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "2) Fast search DB";
            // 
            // pgbUser
            // 
            this.pgbUser.Location = new System.Drawing.Point(6, 247);
            this.pgbUser.Name = "pgbUser";
            this.pgbUser.Size = new System.Drawing.Size(411, 12);
            this.pgbUser.TabIndex = 0;
            // 
            // btnLoadDB
            // 
            this.btnLoadDB.Location = new System.Drawing.Point(10, 265);
            this.btnLoadDB.Name = "btnLoadDB";
            this.btnLoadDB.Size = new System.Drawing.Size(94, 23);
            this.btnLoadDB.TabIndex = 2;
            this.btnLoadDB.Text = "Load DB";
            this.btnLoadDB.UseVisualStyleBackColor = true;
            this.btnLoadDB.Click += new System.EventHandler(this.btnLoadDB_Click);
            // 
            // btnSaveDB
            // 
            this.btnSaveDB.Location = new System.Drawing.Point(113, 265);
            this.btnSaveDB.Name = "btnSaveDB";
            this.btnSaveDB.Size = new System.Drawing.Size(94, 23);
            this.btnSaveDB.TabIndex = 2;
            this.btnSaveDB.Text = "Save DB";
            this.btnSaveDB.UseVisualStyleBackColor = true;
            this.btnSaveDB.Click += new System.EventHandler(this.btnSaveDB_Click);
            // 
            // btnDeleteData
            // 
            this.btnDeleteData.Location = new System.Drawing.Point(216, 265);
            this.btnDeleteData.Name = "btnDeleteData";
            this.btnDeleteData.Size = new System.Drawing.Size(94, 23);
            this.btnDeleteData.TabIndex = 2;
            this.btnDeleteData.Text = "Delete Data";
            this.btnDeleteData.UseVisualStyleBackColor = true;
            this.btnDeleteData.Click += new System.EventHandler(this.btnDeleteData_Click);
            // 
            // btnClearDB
            // 
            this.btnClearDB.Location = new System.Drawing.Point(319, 265);
            this.btnClearDB.Name = "btnClearDB";
            this.btnClearDB.Size = new System.Drawing.Size(94, 23);
            this.btnClearDB.TabIndex = 2;
            this.btnClearDB.Text = "Clear DB";
            this.btnClearDB.UseVisualStyleBackColor = true;
            this.btnClearDB.Click += new System.EventHandler(this.btnClearDB_Click);
            // 
            // lblTotalCount
            // 
            this.lblTotalCount.AutoSize = true;
            this.lblTotalCount.Location = new System.Drawing.Point(291, 18);
            this.lblTotalCount.Name = "lblTotalCount";
            this.lblTotalCount.Size = new System.Drawing.Size(114, 12);
            this.lblTotalCount.TabIndex = 1;
            this.lblTotalCount.Text = "Total data count : 0";
            // 
            // lsvUser
            // 
            this.lsvUser.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader1,
            this.columnHeader2,
            this.columnHeader3});
            this.lsvUser.FullRowSelect = true;
            this.lsvUser.GridLines = true;
            this.lsvUser.HideSelection = false;
            this.lsvUser.Location = new System.Drawing.Point(6, 37);
            this.lsvUser.Name = "lsvUser";
            this.lsvUser.Size = new System.Drawing.Size(411, 212);
            this.lsvUser.TabIndex = 0;
            this.lsvUser.UseCompatibleStateImageBehavior = false;
            this.lsvUser.View = System.Windows.Forms.View.Details;
            // 
            // columnHeader1
            // 
            this.columnHeader1.Text = "User ID";
            this.columnHeader1.Width = 100;
            // 
            // columnHeader2
            // 
            this.columnHeader2.Text = "FP ID";
            this.columnHeader2.Width = 150;
            // 
            // columnHeader3
            // 
            this.columnHeader3.Text = "Sample No";
            this.columnHeader3.Width = 150;
            // 
            // lblStatus
            // 
            this.lblStatus.AutoSize = true;
            this.lblStatus.Location = new System.Drawing.Point(12, 743);
            this.lblStatus.Name = "lblStatus";
            this.lblStatus.Size = new System.Drawing.Size(52, 12);
            this.lblStatus.TabIndex = 7;
            this.lblStatus.Text = "[Status]";
            // 
            // btnOK
            // 
            this.btnOK.Location = new System.Drawing.Point(338, 738);
            this.btnOK.Name = "btnOK";
            this.btnOK.Size = new System.Drawing.Size(98, 23);
            this.btnOK.TabIndex = 6;
            this.btnOK.Text = "OK";
            this.btnOK.UseVisualStyleBackColor = true;
            this.btnOK.Click += new System.EventHandler(this.btnOK_Click);
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.lsvResult);
            this.groupBox3.Controls.Add(this.groupBox4);
            this.groupBox3.Controls.Add(this.lblIdentifyTime);
            this.groupBox3.Controls.Add(this.label3);
            this.groupBox3.Controls.Add(this.btnIdentify);
            this.groupBox3.Location = new System.Drawing.Point(12, 498);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(424, 234);
            this.groupBox3.TabIndex = 5;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "3) Identify (1:N)";
            // 
            // lsvResult
            // 
            this.lsvResult.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader4,
            this.columnHeader5,
            this.columnHeader6});
            this.lsvResult.GridLines = true;
            this.lsvResult.HideSelection = false;
            this.lsvResult.Location = new System.Drawing.Point(6, 124);
            this.lsvResult.Name = "lsvResult";
            this.lsvResult.Size = new System.Drawing.Size(411, 97);
            this.lsvResult.TabIndex = 6;
            this.lsvResult.UseCompatibleStateImageBehavior = false;
            this.lsvResult.View = System.Windows.Forms.View.Details;
            // 
            // columnHeader4
            // 
            this.columnHeader4.Text = "User ID";
            this.columnHeader4.Width = 100;
            // 
            // columnHeader5
            // 
            this.columnHeader5.Text = "FP ID";
            this.columnHeader5.Width = 150;
            // 
            // columnHeader6
            // 
            this.columnHeader6.Text = "Sample No";
            this.columnHeader6.Width = 150;
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.lblIdentifyStatus);
            this.groupBox4.Controls.Add(this.btnStop);
            this.groupBox4.Controls.Add(this.pgbIdentify);
            this.groupBox4.Location = new System.Drawing.Point(9, 49);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(408, 69);
            this.groupBox4.TabIndex = 5;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "Progress info.";
            // 
            // lblIdentifyStatus
            // 
            this.lblIdentifyStatus.AutoSize = true;
            this.lblIdentifyStatus.Location = new System.Drawing.Point(18, 19);
            this.lblIdentifyStatus.Name = "lblIdentifyStatus";
            this.lblIdentifyStatus.Size = new System.Drawing.Size(52, 12);
            this.lblIdentifyStatus.TabIndex = 3;
            this.lblIdentifyStatus.Text = "[Status]";
            // 
            // btnStop
            // 
            this.btnStop.Location = new System.Drawing.Point(308, 36);
            this.btnStop.Name = "btnStop";
            this.btnStop.Size = new System.Drawing.Size(94, 23);
            this.btnStop.TabIndex = 2;
            this.btnStop.Text = "Stop";
            this.btnStop.UseVisualStyleBackColor = true;
            this.btnStop.Click += new System.EventHandler(this.btnStop_Click);
            // 
            // pgbIdentify
            // 
            this.pgbIdentify.Location = new System.Drawing.Point(6, 36);
            this.pgbIdentify.Name = "pgbIdentify";
            this.pgbIdentify.Size = new System.Drawing.Size(291, 23);
            this.pgbIdentify.TabIndex = 0;
            // 
            // lblIdentifyTime
            // 
            this.lblIdentifyTime.AutoSize = true;
            this.lblIdentifyTime.Location = new System.Drawing.Point(302, 25);
            this.lblIdentifyTime.Name = "lblIdentifyTime";
            this.lblIdentifyTime.Size = new System.Drawing.Size(11, 12);
            this.lblIdentifyTime.TabIndex = 4;
            this.lblIdentifyTime.Text = "0";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(233, 25);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(71, 12);
            this.label3.TabIndex = 3;
            this.label3.Text = "Scan Time:";
            // 
            // btnIdentify
            // 
            this.btnIdentify.Location = new System.Drawing.Point(15, 20);
            this.btnIdentify.Name = "btnIdentify";
            this.btnIdentify.Size = new System.Drawing.Size(203, 23);
            this.btnIdentify.TabIndex = 2;
            this.btnIdentify.Text = "Identify fingerprint from DB";
            this.btnIdentify.UseVisualStyleBackColor = true;
            this.btnIdentify.Click += new System.EventHandler(this.btnIdentify_Click);
            // 
            // txtMemberName
            // 
            this.txtMemberName.Location = new System.Drawing.Point(79, 20);
            this.txtMemberName.Name = "txtMemberName";
            this.txtMemberName.Size = new System.Drawing.Size(122, 21);
            this.txtMemberName.TabIndex = 4;
            this.txtMemberName.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(22, 26);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(39, 12);
            this.label2.TabIndex = 3;
            this.label2.Text = "Name";
            // 
            // btnQurey
            // 
            this.btnQurey.Location = new System.Drawing.Point(228, 20);
            this.btnQurey.Name = "btnQurey";
            this.btnQurey.Size = new System.Drawing.Size(167, 23);
            this.btnQurey.TabIndex = 5;
            this.btnQurey.Text = "Search";
            this.btnQurey.UseVisualStyleBackColor = true;
            this.btnQurey.Click += new System.EventHandler(this.btnQurey_Click);
            // 
            // lblSchoolName
            // 
            this.lblSchoolName.Location = new System.Drawing.Point(84, 56);
            this.lblSchoolName.Name = "lblSchoolName";
            this.lblSchoolName.Size = new System.Drawing.Size(229, 14);
            this.lblSchoolName.TabIndex = 6;
            this.lblSchoolName.Text = "-";
            // 
            // lblGrade
            // 
            this.lblGrade.Location = new System.Drawing.Point(84, 77);
            this.lblGrade.Name = "lblGrade";
            this.lblGrade.Size = new System.Drawing.Size(229, 14);
            this.lblGrade.TabIndex = 7;
            this.lblGrade.Text = "-";
            // 
            // EnrollForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(451, 768);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.btnOK);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "EnrollForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "지문 등록";
            this.Load += new System.EventHandler(this.EnrollForm_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Button btnEnroll;
        private System.Windows.Forms.TextBox txtUserID;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.ProgressBar pgbUser;
        private System.Windows.Forms.Button btnLoadDB;
        private System.Windows.Forms.Button btnSaveDB;
        private System.Windows.Forms.Button btnDeleteData;
        private System.Windows.Forms.Button btnClearDB;
        private System.Windows.Forms.Label lblTotalCount;
        private System.Windows.Forms.ListView lsvUser;
        private System.Windows.Forms.ColumnHeader columnHeader1;
        private System.Windows.Forms.ColumnHeader columnHeader2;
        private System.Windows.Forms.ColumnHeader columnHeader3;
        private System.Windows.Forms.Label lblStatus;
        private System.Windows.Forms.Button btnOK;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.ListView lsvResult;
        private System.Windows.Forms.ColumnHeader columnHeader4;
        private System.Windows.Forms.ColumnHeader columnHeader5;
        private System.Windows.Forms.ColumnHeader columnHeader6;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.Label lblIdentifyStatus;
        private System.Windows.Forms.Button btnStop;
        private System.Windows.Forms.ProgressBar pgbIdentify;
        private System.Windows.Forms.Label lblIdentifyTime;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button btnIdentify;
        private System.Windows.Forms.Label lblGrade;
        private System.Windows.Forms.Label lblSchoolName;
        private System.Windows.Forms.Button btnQurey;
        private System.Windows.Forms.TextBox txtMemberName;
        private System.Windows.Forms.Label label2;
    }
}