# Generated by Django 5.0 on 2023-12-26 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0013_alter_photos_name_alter_videos_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='municipalidad',
            name='uploadedFile',
            field=models.FileField(default='C:/Users/axelh/Downloads/imgxd.jpg', upload_to='image/'),
        ),
    ]