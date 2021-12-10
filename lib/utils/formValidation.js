function validateForm(user, res) {
    for (const field in user){
        if (user.hasOwnProperty(field)){
            if (!user[field]){
                return res.status(422).json({
                    errors:{
                        success: false,
                        error: field + ' field is required',
                    }
                });
            }
        }
    }
}

module.exports = validateForm;