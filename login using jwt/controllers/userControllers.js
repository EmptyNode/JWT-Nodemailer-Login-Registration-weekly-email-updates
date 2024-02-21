const users = require("../models/userSchema");
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cron = require('node-cron');

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "0ff1ec33f1979f",
        pass: "852bd3cde28f06"
    }
});

// exports.userregister = async (req, res) => {
//     const { fname, email, password } = req.body;

//     if (!fname || !email || !password) {
//         res.status(400).json({ error: "Please Enter All Input Data" });
//     }

//     try {
//         const existingUser = await users.findOne({ email });

//         if (existingUser) {
//             res.status(400).json({ error: "This User Already exists in our db" });
//         } else {
//             const saltRounds = 10;
//             const hashedPassword = await bcrypt.hash(password, saltRounds);

//             const userregister = new users({
//                 fname,
//                 email,
//                 password: hashedPassword,
//             });

//             const storeData = await userregister.save();
//             res.status(200).json(storeData);
//         }
//     } catch (error) {
//         res.status(400).json({ error: "Invalid Details", error });
//     }
// };

exports.userregister = async (req, res) => {
    const { fname, email, password } = req.body;

    if (!fname || !email || !password) {
        res.status(400).json({ error: "Please Enter All Input Data" });
    }

    try {
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            res.status(400).json({ error: "This User Already exists in our db" });
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const userregister = new users({
                fname,
                email,
                password: hashedPassword,
            });

            const storeData = await userregister.save();

            const OTP = Math.floor(100000 + Math.random() * 900000);
            const saveOtpData = new userotp({
                email,
                otp: OTP,
            });
            await saveOtpData.save();

            const mailOptions = {
                from: 'sumit',
                to: email,
                subject: "Sending Email For OTP Validation",
                text: `OTP:- ${OTP}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error", error);
                    res.status(400).json({ error: "Email not sent" });
                } else {
                    console.log("Email sent", info.response);
                    res.status(200).json({ message: "User registered successfully. Email sent for OTP validation.", userToken: storeData._id });
                }
            });
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error });
    }
};



exports.userOtpSend = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" });
    }

    try {
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existEmail = await userotp.findOne({ email });

            if (existEmail) {
                await userotp.findByIdAndUpdate(
                    { _id: existEmail._id },
                    { otp: OTP },
                    { new: true }
                );
            } else {
                const saveOtpData = new userotp({
                    email,
                    otp: OTP,
                });
                await saveOtpData.save();
            }

            const mailOptions = {
                from: 'user', 
                to: email,
                subject: "Sending Email For OTP Validation",
                text: `OTP:- ${OTP}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error", error);
                    res.status(400).json({ error: "Email not sent" });
                } else {
                    console.log("Email sent", info.response);
                    res.status(200).json({ message: "Email sent Successfully", OTP });
                }
            });
        } else {
            res.status(400).json({ error: "This User Not Exist In our Db" });
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error });
    }
};



exports.userLogin = async (req, res) => {
    const { email, otp } = req.body;

    if (!otp || !email) {
        res.status(400).json({ error: "Please Enter Your OTP and email" });
    }

    try {
        const otpVerification = await userotp.findOne({ email });

        if (otpVerification && otpVerification.otp === otp) {
            const preuser = await users.findOne({ email });

            const token = jwt.sign({ email }, "9874225471", { expiresIn: "1h" });
            res.status(200).json({ message: "User Login Successfully Done", userToken: token });
        } else {
            res.status(400).json({ error: "Invalid Otp" });
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error });
    }
};


exports.sendWeeklyReminder = async () => {
    try {
        const registeredUsers = await users.find(); 

        for (const user of registeredUsers) {
            const mailOptions = {
                from: 'Sumit',
                to: user.email,
                subject: "Weekly Reminder",
                text: "Hello world! This is your weekly reminder.",
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(`Reminder email not sent to ${user.email}`, error);
                } else {
                    console.log(`Reminder email sent to ${user.email}`, info.response);
                }
            });
        }

        console.log("Reminder emails sent successfully.");
    } catch (error) {
        console.error("Error sending reminders", error);
    }
};

cron.schedule('0 0 * * 0', () => {
    sendWeeklyReminder();
});