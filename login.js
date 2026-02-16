document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const errorMessage = document.getElementById('error-message');

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

    if (accessToken) {
        // Step 3: Verify the user's role
        verifyUserRole(accessToken);
    }

    loginButton.addEventListener('click', () => {
        const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=token&scope=identify%20guilds.members.read`;
        window.location.href = discordAuthUrl;
    });

    async function verifyUserRole(token) {
        try {
            // Get user's guild member information
            const memberResponse = await fetch(`https://discord.com/api/users/@me/guilds/${config.guildId}/member`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            if (!memberResponse.ok) {
                // If the user is not in the guild, the API will return an error
                throw new Error('User is not a member of the specified server.');
            }

            const memberData = await memberResponse.json();
            const userRoles = memberData.roles;

            if (userRoles.includes(config.roleId)) {
                // User has the required role, redirect to the main page
                window.location.href = 'main.html'; // Or your desired protected page
            } else {
                // User does not have the role
                errorMessage.textContent = '您没有访问权限，请联系管理员。';
            }
        } catch (error) {
            console.error('Error verifying user role:', error);
            errorMessage.textContent = '验证身份时出错，请稍后重试。';
        }
    }
});