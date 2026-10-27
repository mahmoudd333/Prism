const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const Admin = require("./models/Admin");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  try {
    const email = (await ask("Admin email: "))
      .trim()
      .toLowerCase();

    const password = await ask("Admin password: ");

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error("Enter a valid email address.");
    }

    if (password.length < 12) {
      throw new Error("Use a password with at least 12 characters.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      throw new Error("An admin with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
    rl.close();
  }
}

main();
