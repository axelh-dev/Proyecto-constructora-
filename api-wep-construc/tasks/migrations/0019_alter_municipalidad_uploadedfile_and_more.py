# Generated by Django 5.0 on 2024-01-11 02:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0018_alter_municipalidad_uploadedfile_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='municipalidad',
            name='uploadedFile',
            field=models.FileField(default='NULL', upload_to='image/'),
        ),
        migrations.AlterField(
            model_name='photos',
            name='uploadedFile',
            field=models.FileField(default='NULL', upload_to='image/'),
        ),
        migrations.AlterField(
            model_name='videos',
            name='uploadedFile',
            field=models.FileField(default='NULL', upload_to='Videos/'),
        ),
    ]
