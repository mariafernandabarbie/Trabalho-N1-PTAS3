const bcrypt = require('bcryptjs');
const User = require('../models/User');
const secret = require('../config/auth.json');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newpassword = await bcrypt.hash(password, 10); 

        await User.create({
            name: name,
            password: newpassword, 
            email: email
        }).then(() => {
            res.json('Cadastro de usuário realizado com sucesso!');
            console.log('Cadastro de usuário realizado com sucesso!');
        }).catch((erro) => {
            res.json("Deu erro!");
            console.log(`Ops, deu erro: ${erro}`);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Erro interno do servidor');
    }
}


const searchUsers = async (req, res) => {
    const users = await User.findAll()
    try {
        res.json(users);
    }
    catch (error) {
        res.status(404).json("Deu erro")
    }
}


const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await User.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.json("Usuário deletado")
        })
    } catch (error) {
        res.status(404).json("Deu erro!")
    }
}

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, password, email } = req.body;
    try {
        await User.update({
            name: name,
            password: password,
            email: email
        },
            {
                where: {
                    id: id
                }
            }).then(() => {
                res.json("Usuário alterado!")
            })
    }
    catch (error) {
        res.status(404).json("Deu erro!")
    } 
}

const authenticatedUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const isUserAthenticated = await User.findOne({
            where: {
                email: email,
                password: newpassword,
                password: response
            }
        })
        if (!user) {
            return res.json('Usuário não encontrado');
        }

        const response = await bcrypt.compare(password, user.password);

        if (!response) {
            return res.json('Senha incorreta');
        }

        const token = jwt.sign({ id: email }, secret.secret, {
            expiresIn: 86400,
        })
        return res.json({
            name: isUserAthenticated.name,
            email: isUserAthenticated.email,
            token: token
        });
    } catch (error) {
        return res.json('Usuário nao encontrado');
    }
}


module.exports = { createUser, searchUsers, deleteUser, updateUser, authenticatedUser };
