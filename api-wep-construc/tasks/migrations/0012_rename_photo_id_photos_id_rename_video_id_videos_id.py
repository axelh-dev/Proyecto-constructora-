# Generated by Django 5.0 on 2023-12-25 04:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0011_appuser_is_staff'),
    ]

    operations = [
        migrations.RenameField(
            model_name='photos',
            old_name='photo_id',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='videos',
            old_name='video_id',
            new_name='id',
        ),
    ]
